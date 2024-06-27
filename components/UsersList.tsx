'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface User {
    id: number;
    name: string;
    email: string;
    registerDay: string;
    phone?: string;
}

export default function UsersList() {
    const [users, setUsers] = useState<User[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users/get-users');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDeleteUser = async (id: number) => {
        try {
            const response = await fetch('/api/users/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                setUsers((prevUsers) => prevUsers?.filter((user) => user.id !== id) || null);
                console.log('User deleted successfully');
            } else {
                throw new Error('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Users List</h1>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Register Day</th>
                    <th>Phone</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users?.map((user) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{new Date(user.registerDay).toLocaleDateString()}</td>
                        <td>{user.phone}</td>
                        <td>
                            <Link href={`/edit-user?id=${user.id}&name=${user.name}&email=${user.email}&phone=${user.phone}`}>
                                <button>Edit</button>
                            </Link>
                            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
