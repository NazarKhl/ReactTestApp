import { useState, useEffect } from 'react';
import './App.css';
import { Modal, Button, Input } from 'antd';

export default function App() {
    const [users, setUsers] = useState([]);
    const [userFinder, setUserFinder] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModal, setIsUpdateModal] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        showUsers();
    }, []);

    const showUsers = async () => {
        setLoading(true);
        const response = await fetch('user');
        const data = await response.json();
        setUsers(data);
        setLoading(false);
        setUserFinder('');
    };

    const handleInput = (e) => {
        setUserFinder(e.target.value);
    }

    const showModal = (user = null) => {
        setSelectedUser(user);
        setIsModalOpen(true);
        setOpen(true);
        setIsUpdateModal(!!user);
    };

    const hideModal = () => {
        setOpen(false);
    };

    const handleOk = async () => {
        if (isUpdateModal && selectedUser) {
            await fetch(`user/${selectedUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedUser),
            });
            showUsers();
        }
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleDelete = (userId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this user?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                await fetch(`user/${userId}`, {
                    method: 'DELETE',
                });
                showUsers();
            },
        });
    };

    const handleInputChange = (e) => {
        setSelectedUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const downloadJSON = () => {
        const blob = new Blob([JSON.stringify(users, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'users.json';
        link.click();
        URL.revokeObjectURL(url); 
    }

    const filteredUsers = userFinder
        ? users.filter(user => user.id === parseInt(userFinder, 10))
        : users;

    const contents = loading
        ? <p><em>Loading... Please wait.</em></p>
        : filteredUsers.length === 0
            ? <p><em>No users found. Click "Show user" to fetch data.</em></p>
            : <table className="table table-striped" aria-labelledby="tableLabel">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user =>
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <Button style={{ marginRight: 10 }} onClick={() => showModal(user)}>Update</Button>
                                <Button onClick={() => handleDelete(user.id)} danger>Delete</Button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>;

    return (
        <div>
            <h1 id="tableLabel">User Data</h1>
            <Input
                min={1}
                value={userFinder}
                onChange={handleInput}
                type="number"
                style={{ borderRadius: 15, fontFamily: 'cursive', padding: 10, fontWeight: 'bold', marginLeft: 10 }}
                placeholder='Find by ID'
            />
            <Button
                onClick={showUsers}
                style={{ marginTop: 13, padding: 10, fontWeight: 'bold', marginLeft: 10 }}
            >
                Show all users
            </Button>
            <Button style={{ marginTop: 13, padding: 10, fontWeight: 'bold', marginLeft: 10 }} onClick={downloadJSON}>Download .json</Button>
            <p>This component demonstrates fetching data from the server.</p>
            {contents}
            <Modal
                title={isUpdateModal ? "Update User" : "User Details"}
                visible={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                {isUpdateModal ? (
                    <div>
                        <Input
                            style={{ marginBottom: 10 }}
                            name="name"
                            value={selectedUser?.name || ''}
                            onChange={handleInputChange}
                            placeholder="Name"
                        />
                        <Input
                            name="email"
                            value={selectedUser?.email || ''}
                            onChange={handleInputChange}
                            placeholder="Email"
                        />
                    </div>
                ) : (
                    <div>
                        <p>Id: {selectedUser?.id}</p>
                        <p>Name: {selectedUser?.name}</p>
                        <p>Email: {selectedUser?.email}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
}
