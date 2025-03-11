// ⚠️ Đây là mock data, khi nào có services student/room/notification sẽ kết nối thật.
export const getDashboardStats = async () => {
    return {
        emptyRooms: 10,
        totalStudents: 150,
        pendingPayments: 20,
    };
};

export const getImportantNotifications = async () => {
    return [
        { message: 'Thông báo khẩn cấp về phòng KTX.' },
        { message: 'Hạn chót đóng tiền KTX tháng 4 là 25/04/2025.' },
    ];
};

export const getStudentStatsByMonth = async () => {
    return [
        { month: 'Tháng 1', count: 120 },
        { month: 'Tháng 2', count: 130 },
        { month: 'Tháng 3', count: 150 },
        { month: 'Tháng 4', count: 145 },
    ];
};

export const getFinanceReport = async () => {
    return [
        { month: 'Tháng 1', income: 50000, expense: 20000 },
        { month: 'Tháng 2', income: 52000, expense: 22000 },
        { month: 'Tháng 3', income: 53000, expense: 21000 },
        { month: 'Tháng 4', income: 54000, expense: 25000 },
    ];
};
