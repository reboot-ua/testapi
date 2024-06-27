'use client'
import { useState, useEffect, FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
}

export default function EditUserPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        const loadUserData = async () => {
            if (id && name && email) {
                setUser({
                    id: Number(id),
                    name: name as string,
                    email: email as string,
                    phone: phone || undefined,
                });
                setFormData({
                    name: name as string,
                    email: email as string,
                    phone: phone || '',
                });
                setLoading(false);
            } else if (id) {
                try {
                    const response = await fetch(`/api/users/get-user?id=${id}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch user data');
                    }
                    const userData = await response.json();
                    setUser(userData);
                    setFormData({
                        name: userData.name,
                        email: userData.email,
                        phone: userData.phone || '',
                    });
                } catch (error) {
                    console.error('Failed to fetch user data', error);
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadUserData();
    }, [id, name, email, phone]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/users/edit', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: user?.id, ...formData }),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                console.log('User updated:', updatedUser);
            } else {
                throw new Error('Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>Failed to load user</div>;

    return (
        <div>
            <h1>Edit User</h1>
            <Link href={'/'}>Home</Link>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    placeholder="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />
                <button type="submit">Edit User</button>
            </form>
        </div>
    );
}
