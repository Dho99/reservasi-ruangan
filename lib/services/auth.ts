export const authService = {
    register: () => ({url: '/api/auth/register', method: 'POST'}),
    adminRegister: () => ({url: '/api/auth/admin/register', method: 'POST'}),
}