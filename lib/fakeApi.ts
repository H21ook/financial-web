export interface Transaction {
    id: number;
    category: string;
    date: string;
    description: string;
    amount: number;
    status: string;
    from: string;
    to: string;
}

export const CATEGORIES = [
    'Transfer',
    'Payment',
    'Business',
    'Advertising',
    'Subscription',
];
export const STATUSES = ['Active', 'Pending', 'Cancelled'];
export const ENTITIES = [
    'Stripe',
    'Facebook Charge',
    'Upwork Payment',
    'Apple Store',
    'Google Cloud',
    'Netflix',
    'Amazon Web Services',
];

export const MOCK_DATA: Transaction[] = Array.from({ length: 100 }, (_, i) => {
    const isIncome = Math.random() > 0.5;
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const entity = ENTITIES[Math.floor(Math.random() * ENTITIES.length)];

    return {
        id: i + 1,
        category: category,
        date: `2025-12-${String(Math.floor(Math.random() * 28) + 1).padStart(
            2,
            '0'
        )}`,
        description: isIncome ? `Received from ${entity}` : `Paid to ${entity}`,
        from: isIncome ? entity : 'My Wallet',
        to: isIncome ? 'My Wallet' : entity,
        amount: Number(
            (isIncome
                ? Math.random() * 5000 + 100
                : -(Math.random() * 2000 + 50)
            ).toFixed(2)
        ),
        status: status,
    };
});

export const fetchTransactions = async (
    page: number,
    pageSize: number,
    searchTerm: string,
    category: string,
    dateRange: string,
    status: string
) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    let filtered = [...MOCK_DATA];

    if (category !== 'all') {
        filtered = filtered.filter((item) => item.category === category);
    }

    if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        filtered = filtered.filter(
            (item) =>
                item.description.toLowerCase().includes(lowerSearch) ||
                item.from.toLowerCase().includes(lowerSearch) ||
                item.to.toLowerCase().includes(lowerSearch) ||
                item.id.toString().includes(lowerSearch)
        );
    }

    if (status !== 'all') {
        filtered = filtered.filter((item) => item.status === status);
    }

    if (dateRange !== 'all') {
        const today = new Date();
        if (dateRange === 'lastWeek') {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 7);
            filtered = filtered.filter((item) => new Date(item.date) >= sevenDaysAgo);
        }
        if (dateRange === 'lastMonth') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(today.getDate() - 30);
            filtered = filtered.filter(
                (item) => new Date(item.date) >= thirtyDaysAgo
            );
        }
    }

    const total = filtered.length;
    const totalAmount = Number(
        filtered.reduce((sum, item) => sum + item.amount, 0).toFixed(2)
    );

    const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

    return { rows, total, totalAmount };
};
