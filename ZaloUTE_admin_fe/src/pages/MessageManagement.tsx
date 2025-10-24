import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Input,
  Select,
  DatePicker,
  message,
  Tooltip,
  Image,
  Tabs,
  Statistic,
  Row,
  Col,
  Popconfirm,
  Form,
} from "antd";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  DeleteOutlined,
  UndoOutlined,
  SearchOutlined,
  ReloadOutlined,
  FileTextOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import ApiService from "../services/api";
import {
  Message,
  HiddenMessage,
  MediaMessagesResponse,
  HiddenMessagesResponse,
  HiddenMessageStats,
} from "../types";

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

interface MessageFilters {
  page: number;
  limit: number;
  conversationId?: string;
  senderId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: string;
}

interface HiddenMessageFilters {
  page: number;
  limit: number;
  status?: string;
  hiddenBy?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: string;
}

const MessageManagement: React.FC = () => {
  // States
  const [activeTab, setActiveTab] = useState("media");
  const [mediaMessages, setMediaMessages] = useState<Message[]>([]);
  const [hiddenMessages, setHiddenMessages] = useState<HiddenMessage[]>([]);
  const [stats, setStats] = useState<HiddenMessageStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [hideModalVisible, setHideModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [hideReason, setHideReason] = useState("");

  // Pagination states
  const [mediaPagination, setMediaPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [hiddenPagination, setHiddenPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Filter states
  const [mediaFilters, setMediaFilters] = useState<MessageFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [hiddenFilters, setHiddenFilters] = useState<HiddenMessageFilters>({
    page: 1,
    limit: 10,
    status: "hidden",
    sortBy: "hiddenAt",
    sortOrder: "desc",
  });

  // Load data functions
  const loadMediaMessages = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getMediaMessages(mediaFilters);
      if (response.success) {
        setMediaMessages(response.data.messages);
        setMediaPagination({
          current: response.data.pagination.currentPage,
          pageSize: response.data.pagination.limit,
          total: response.data.pagination.totalMessages,
        });
      }
    } catch (error: any) {
      message.error("Lỗi khi tải tin nhắn media: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadHiddenMessages = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getAllHiddenMessages(hiddenFilters);
      if (response.success) {
        setHiddenMessages(response.data.hiddenMessages);
        setHiddenPagination({
          current: response.data.pagination.currentPage,
          pageSize: response.data.pagination.limit,
          total: response.data.pagination.totalMessages,
        });
      }
    } catch (error: any) {
      message.error("Lỗi khi tải tin nhắn ẩn: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await ApiService.getHiddenMessageStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error: any) {
      message.error("Lỗi khi tải thống kê: " + error.message);
    }
  };

  // Actions
  const handleHideMessage = async () => {
    if (!selectedMessage) return;

    try {
      const response = await ApiService.hideMessage(
        selectedMessage._id,
        hideReason
      );
      if (response.success) {
        message.success("Ẩn tin nhắn thành công");
        setHideModalVisible(false);
        setHideReason("");
        setSelectedMessage(null);
        loadMediaMessages();
        loadHiddenMessages();
        loadStats();
      }
    } catch (error: any) {
      message.error("Lỗi khi ẩn tin nhắn: " + error.message);
    }
  };

  const handleRestoreMessage = async (messageId: string) => {
    try {
      const response = await ApiService.restoreMessage(messageId);
      if (response.success) {
        message.success("Khôi phục tin nhắn thành công");
        loadMediaMessages();
        loadHiddenMessages();
        loadStats();
      }
    } catch (error: any) {
      message.error("Lỗi khi khôi phục tin nhắn: " + error.message);
    }
  };

  const handleDeletePermanently = async (messageId: string) => {
    try {
      const response = await ApiService.deleteMessagePermanently(messageId);
      if (response.success) {
        message.success("Xóa tin nhắn vĩnh viễn thành công");
        loadHiddenMessages();
        loadStats();
      }
    } catch (error: any) {
      message.error("Lỗi khi xóa tin nhắn: " + error.message);
    }
  };

  // Utility functions
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <PictureOutlined style={{ color: "#52c41a" }} />;
      case "video":
        return <VideoCameraOutlined style={{ color: "#1890ff" }} />;
      case "file":
        return <FolderOutlined style={{ color: "#faad14" }} />;
      default:
        return <FileTextOutlined />;
    }
  };

  const getTypeTag = (type: string) => {
    const colors = {
      image: "green",
      video: "blue",
      file: "orange",
      text: "default",
    };
    return (
      <Tag color={colors[type as keyof typeof colors]}>
        {type.toUpperCase()}
      </Tag>
    );
  };

  const renderContent = (content: string, type: string) => {
    if (type === "image") {
      return (
        <Image
          width={100}
          src={content}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
        />
      );
    }
    return (
      <Tooltip title={content}>
        <div
          style={{
            maxWidth: 200,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {content}
        </div>
      </Tooltip>
    );
  };

  // Table columns
  const mediaColumns: ColumnsType<Message> = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      width: 100,
      render: (id) => (
        <Tooltip title={id}>
          <span>{id.substring(0, 8)}...</span>
        </Tooltip>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 80,
      render: (type) => (
        <Space>
          {getTypeIcon(type)}
          {getTypeTag(type)}
        </Space>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      render: (content, record) => renderContent(content, record.type),
    },
    {
      title: "Người gửi",
      key: "sender",
      render: (record) => (
        <div>
          <div>{record.sender?.username || "N/A"}</div>
          <small style={{ color: "#666" }}>{record.sender?.email || ""}</small>
        </div>
      ),
    },
    {
      title: "Cuộc hội thoại",
      key: "conversation",
      render: (record) => (
        <div>
          <div>{record.conversation?.name || "Chat 1-1"}</div>
          <small style={{ color: "#666" }}>
            {record.conversation?.isGroup ? "Nhóm" : "Cá nhân"}
          </small>
        </div>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      render: (record) => (
        <Space>
          <Tooltip title="Ẩn tin nhắn">
            <Button
              type="text"
              icon={<EyeInvisibleOutlined />}
              onClick={() => {
                setSelectedMessage(record);
                setHideModalVisible(true);
              }}
              danger
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const hiddenColumns: ColumnsType<HiddenMessage> = [
    {
      title: "ID Tin nhắn",
      key: "messageId",
      width: 100,
      render: (record) => (
        <Tooltip title={record.messageId?._id}>
          <span>{record.messageId?._id?.substring(0, 8)}...</span>
        </Tooltip>
      ),
    },
    {
      title: "Nội dung gốc",
      dataIndex: "originalContent",
      key: "originalContent",
      render: (content, record) => renderContent(content, record.originalType),
    },
    {
      title: "Loại gốc",
      dataIndex: "originalType",
      key: "originalType",
      width: 100,
      render: (type) => getTypeTag(type),
    },
    {
      title: "Người ẩn",
      key: "hiddenBy",
      render: (record) => record.hiddenBy?.username || "N/A",
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      render: (reason) => reason || "Không có lý do",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colors = {
          hidden: "orange",
          restored: "green",
          deleted: "red",
        };
        const labels = {
          hidden: "Đã ẩn",
          restored: "Đã khôi phục",
          deleted: "Đã xóa",
        };
        return (
          <Tag color={colors[status as keyof typeof colors]}>
            {labels[status as keyof typeof labels]}
          </Tag>
        );
      },
    },
    {
      title: "Thời gian ẩn",
      dataIndex: "hiddenAt",
      key: "hiddenAt",
      width: 150,
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      render: (record) => (
        <Space>
          {record.status === "hidden" && (
            <>
              <Tooltip title="Khôi phục">
                <Popconfirm
                  title="Bạn có chắc muốn khôi phục tin nhắn này?"
                  onConfirm={() => handleRestoreMessage(record.messageId._id)}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button
                    type="text"
                    icon={<UndoOutlined />}
                    style={{ color: "#52c41a" }}
                  />
                </Popconfirm>
              </Tooltip>
              <Tooltip title="Xóa vĩnh viễn">
                <Popconfirm
                  title="Bạn có chắc muốn xóa vĩnh viễn tin nhắn này?"
                  onConfirm={() =>
                    handleDeletePermanently(record.messageId._id)
                  }
                  okText="Có"
                  cancelText="Không"
                >
                  <Button type="text" icon={<DeleteOutlined />} danger />
                </Popconfirm>
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  // Effects
  useEffect(() => {
    if (activeTab === "media") {
      loadMediaMessages();
    } else if (activeTab === "hidden") {
      loadHiddenMessages();
    }
    loadStats();
  }, [activeTab, mediaFilters, hiddenFilters]);

  return (
    <div style={{ padding: "24px" }}>
      <Card
        title="Quản lý tin nhắn"
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              if (activeTab === "media") {
                loadMediaMessages();
              } else {
                loadHiddenMessages();
              }
              loadStats();
            }}
          >
            Làm mới
          </Button>
        }
      >
        {/* Statistics */}
        {stats && (
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Tổng tin nhắn đã ẩn"
                  value={stats.totalAll}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Đang ẩn"
                  value={stats.totalHidden}
                  valueStyle={{ color: "#faad14" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Đã khôi phục"
                  value={stats.totalRestored}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Đã xóa vĩnh viễn"
                  value={stats.totalDeleted}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
          </Row>
        )}

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Tin nhắn Media" key="media">
            <Table
              columns={mediaColumns}
              dataSource={mediaMessages}
              rowKey="_id"
              loading={loading}
              pagination={{
                ...mediaPagination,
                onChange: (page, pageSize) => {
                  setMediaFilters((prev) => ({
                    ...prev,
                    page,
                    limit: pageSize || 10,
                  }));
                },
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} tin nhắn`,
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>

          <TabPane tab="Tin nhắn đã ẩn" key="hidden">
            <Table
              columns={hiddenColumns}
              dataSource={hiddenMessages}
              rowKey="_id"
              loading={loading}
              pagination={{
                ...hiddenPagination,
                onChange: (page, pageSize) => {
                  setHiddenFilters((prev) => ({
                    ...prev,
                    page,
                    limit: pageSize || 10,
                  }));
                },
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} tin nhắn`,
              }}
              scroll={{ x: 1400 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Hide Message Modal */}
      <Modal
        title="Ẩn tin nhắn"
        open={hideModalVisible}
        onOk={handleHideMessage}
        onCancel={() => {
          setHideModalVisible(false);
          setHideReason("");
          setSelectedMessage(null);
        }}
        okText="Ẩn tin nhắn"
        cancelText="Hủy"
      >
        <div style={{ marginBottom: 16 }}>
          <strong>Tin nhắn:</strong>
          {selectedMessage && (
            <div
              style={{
                marginTop: 8,
                padding: 12,
                border: "1px solid #d9d9d9",
                borderRadius: 6,
                backgroundColor: "#fafafa",
              }}
            >
              <Space>
                {getTypeIcon(selectedMessage.type)}
                {getTypeTag(selectedMessage.type)}
              </Space>
              <div style={{ marginTop: 8 }}>
                {renderContent(selectedMessage.content, selectedMessage.type)}
              </div>
            </div>
          )}
        </div>

        <Form.Item label="Lý do ẩn tin nhắn (tùy chọn)">
          <TextArea
            rows={3}
            value={hideReason}
            onChange={(e) => setHideReason(e.target.value)}
            placeholder="Nhập lý do ẩn tin nhắn..."
          />
        </Form.Item>
      </Modal>
    </div>
  );
};

export default MessageManagement;
