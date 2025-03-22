// ⚠️ Đây là mock data, khi nào có services student/room/notification sẽ kết nối thật.
import api from './api';

export const getDashboardStats = async () => {
    // Giả lập data (có thể thay bằng API sau này)
    return {
        emptyRooms: 10,
        currentStudents: 150,
        finance: { income: '50M', expense: '20M' },
        notifications: 5,
    };
};


export const getImportantNotifications = async () => {
    return [
        { message: 'Thông báo khẩn cấp về phòng KTX.' },
        { message: 'Hạn chót đóng tiền KTX tháng 4 là 25/04/2025.' },
    ];
};

export const getStudentChart = async () => {
    return {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        students: [100, 120, 130, 110, 150, 160],
    };
};

export const getFinanceChart = async () => {
    return {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        income: [10, 15, 12, 18, 20, 22],
        expense: [5, 7, 6, 8, 9, 10],
    };
}; // Sử dụng chung API Gateway

export const getDashboardData = async () => {
    try {
        // Tạm thời giả lập data, sau kết nối API Gateway thì sửa lại chỗ này
        return {
            availableRooms: 15,
            occupiedStudents: 85,
            paymentStatus: {
                paid: 70,
                unpaid: 15
            },
            studentStats: [
                { month: 'January', count: 10 },
                { month: 'February', count: 15 },
                { month: 'March', count: 20 },
                { month: 'April', count: 18 },
                { month: 'May', count: 25 },
                { month: 'June', count: 22 }
            ],
            finance: {
                income: 15000,
                expenses: 7000
            },
            notifications: [
                { id: 1, message: "Hạn cuối nộp phí KTX tháng này là 30/03" },
                { id: 2, message: "Bắt đầu kiểm tra phòng từ 20/03" },
                { id: 3, message: "Đã cập nhật lịch học kỳ mới" },
                { id: 4, message: "Thông báo về việc sửa chữa hệ thống điện" },
                { id: 5, message: "Hướng dẫn đăng ký tín chỉ học kỳ mới" }
            ]
        };
        // Khi có API thật:
        // const res = await api.get('/dashboard');
        // return res.data;
    } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        return null;
    }
};
