
import React, { useState } from 'react';
import { LockIcon } from './icons/LockIcon';

interface LoginScreenProps {
  onLogin: (password: string) => boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = onLogin(password);
        if (!success) {
            setError('Falsches Passwort. Bitte versuche es erneut.');
            setPassword('');
        } else {
            setError('');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
            <div className="w-full max-w-sm mx-auto p-4">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-sky-100 dark:bg-sky-900/50 mb-4">
                        <LockIcon className="h-8 w-8 text-sky-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Zugriff geschützt</h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Bitte gib das Passwort ein, um fortzufahren.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Passwort"
                                aria-label="Passwort"
                                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors text-center"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-800 transition-transform transform active:scale-95 shadow-lg hover:shadow-sky-500/20"
                        >
                            Entsperren
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
