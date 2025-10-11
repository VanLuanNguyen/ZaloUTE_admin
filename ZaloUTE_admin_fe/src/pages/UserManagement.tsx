import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Popconfirm, 
  message, 
  Tag, 
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Form,
  Modal
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  DeleteOutlined, 
  UserSwitchOutlined,
  EyeOutlined 
} from '@ant-design/icons';
import apiService from '../services/api';
import { User } from '../types';
import moment from 'moment';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllUsers(
        pagination.current,
        pagination.pageSize,
        searchText
      );
      
      if (response.success) {
        setUsers(response.data as any);
        setPagination(prev => ({
          ...prev,
          total: response.pagination?.totalItems || 0
        }));
      }
    } catch (error) {
      message.error('Không thể tải danh sách người dùng!');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchUsers();
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      const response = await apiService.toggleUserStatus(userId);
      if (response.success) {
        message.success('Thay đổi trạng thái thành công!');
        fetchUsers();
      }
    } catch (error) {
      message.error('Không thể thay đổi trạng thái!');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await apiService.deleteUser(userId);
      if (response.success) {
        message.success('Xóa người dùng thành công!');
        fetchUsers();
      }
    } catch (error) {
      message.error('Không thể xóa người dùng!');
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const columns = [
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => phone || '-',
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (fullName: string) => fullName || '-',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Bị khóa'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => moment(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewUser(record)}
          >
            Xem
          </Button>
          <Button
            type={record.isActive ? 'default' : 'primary'}
            size="small"
            icon={<UserSwitchOutlined />}
            onClick={() => handleToggleStatus(record._id)}
          >
            {record.isActive ? 'Khóa' : 'Mở khóa'}
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa người dùng này?"
            onConfirm={() => handleDeleteUser(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24, color: '#262626' }}>Quản lý người dùng</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm theo tên, email..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
              size="large"
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchUsers}
              size="large"
              style={{ width: '100%' }}
            >
              Làm mới
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} người dùng`,
          }}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title="Chi tiết người dùng"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={600}
      >
        {selectedUser && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <strong>Tên đăng nhập:</strong>
                <p>{selectedUser.username}</p>
              </Col>
              <Col span={12}>
                <strong>Email:</strong>
                <p>{selectedUser.email}</p>
              </Col>
              <Col span={12}>
                <strong>Số điện thoại:</strong>
                <p>{selectedUser.phone || '-'}</p>
              </Col>
              <Col span={12}>
                <strong>Họ tên:</strong>
                <p>{selectedUser.fullName || '-'}</p>
              </Col>
              <Col span={12}>
                <strong>Trạng thái:</strong>
                <p>
                  <Tag color={selectedUser.isActive ? 'green' : 'red'}>
                    {selectedUser.isActive ? 'Hoạt động' : 'Bị khóa'}
                  </Tag>
                </p>
              </Col>
              <Col span={12}>
                <strong>Ngày tạo:</strong>
                <p>{moment(selectedUser.createdAt).format('DD/MM/YYYY HH:mm')}</p>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
