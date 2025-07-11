import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Space, 
  message, 
  Popconfirm, 
  Switch,
  Tag
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { authService } from '../../services/userService';
import './index.scss';

const UserManage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 获取用户列表
  const fetchUsers = async (page = pagination.current, limit = pagination.pageSize) => {
    setLoading(true);
    try {
      const response = await authService.getUserList({ page, limit });
      setUsers(response.data || []);
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: limit,
        total: response.pagination.totalItems || 0,
      }));
    } catch (error) {
      message.error('获取用户列表失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 页面加载时获取用户列表
  useEffect(() => {
    fetchUsers();
  }, []);

  // 处理分页变化
  const handleTableChange = (paginationConfig) => {
    fetchUsers(paginationConfig.current, paginationConfig.pageSize);
  };

  // 打开新增用户模态框
  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 打开编辑用户模态框
  const handleEdit = (record) => {
    if (record.isAdmin) {
      message.warning('管理员用户禁止编辑');
      return;
    }
    setEditingUser(record);
    form.setFieldsValue({
      ...record,
      password: '' // 不显示原密码
    });
    setModalVisible(true);
  };

  // 删除用户
  const handleDelete = async (id) => {
    // 查找要删除的用户
    const userToDelete = users.find(user => user.id === id);
    if (userToDelete && userToDelete.isAdmin) {
      message.warning('管理员用户禁止删除');
      return;
    }
    
    try {
      await authService.deleteUser(id);
      message.success('删除用户成功');
      fetchUsers();
    } catch (error) {
      message.error('删除用户失败：' + error.message);
    }
  };

  // 提交表单
  const handleSubmit = async (values) => {
    try {
      if (editingUser) {
        // 编辑用户
        const updateData = { ...values };
        if (!updateData.password) {
          delete updateData.password; // 如果密码为空，不更新密码
        }
        await authService.updateUser(editingUser.id, updateData);
        message.success('更新用户成功');
      } else {
        // 新增用户
        await authService.createUser(values);
        message.success('创建用户成功');
      }
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error(`${editingUser ? '更新' : '创建'}用户失败：` + error.message);
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: '姓',
      dataIndex: 'firstName',
      key: 'firstName',
      width: 100,
    },
    {
      title: '名',
      dataIndex: 'lastName',
      key: 'lastName',
      width: 100,
    },
    {
      title: '管理员',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      width: 100,
      render: (isAdmin) => (
        <Tag color={isAdmin ? 'red' : 'blue'}>
          {isAdmin ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? '激活' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={record.isAdmin}
            title={record.isAdmin ? "管理员用户禁止编辑" : ""}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
            disabled={record.isAdmin}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              disabled={record.isAdmin}
              title={record.isAdmin ? "管理员用户禁止删除" : ""}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-manage-page">
      
      <div className="user-content">
        <div className="table-toolbar">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增用户
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
        />

        <Modal
          title={editingUser ? '编辑用户' : '新增用户'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>

            <Form.Item
              name="firstName"
              label="姓"
              rules={[{ required: true, message: '请输入姓' }]}
            >
              <Input placeholder="请输入姓" />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="名"
              rules={[{ required: true, message: '请输入名' }]}
            >
              <Input placeholder="请输入名" />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={editingUser ? [] : [{ required: true, message: '请输入密码' }]}
            >
              <Input.Password 
                placeholder={editingUser ? "留空则不修改密码" : "请输入密码"} 
              />
            </Form.Item>

            <Form.Item
              name="isAdmin"
              label="管理员权限"
              valuePropName="checked"
            >
              <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>

            <Form.Item
              name="isActive"
              label="用户状态"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch checkedChildren="激活" unCheckedChildren="禁用" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingUser ? '更新' : '创建'}
                </Button>
                <Button onClick={() => setModalVisible(false)}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default UserManage;
