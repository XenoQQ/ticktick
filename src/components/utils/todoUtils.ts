import { TodoItemProps, SortCase, PriorityMap, groupKey } from '../../controls/types';

export const sortTodos = (todos: TodoItemProps[], option: SortCase): TodoItemProps[] => {
    const todosCopy = [...todos];
    switch (option) {
        case 'date':
            return todosCopy.sort((a, b) => {
                const dateA = a.data.targetDate ? new Date(a.data.targetDate).getTime() : null;
                const dateB = b.data.targetDate ? new Date(b.data.targetDate).getTime() : null;

                if (dateA === null) return 1;
                if (dateB === null) return -1;
                return dateA - dateB;
            });

        case 'name':
            return todosCopy.sort((a, b) => a.data.content.localeCompare(b.data.content));

        case 'tag':
            return todosCopy.sort((a, b) => a.data.tags[0].localeCompare(b.data.tags[0]));

        case 'priority': {
            const priorityOrder = { high: 1, medium: 2, low: 3, none: 4 };
            return todosCopy.sort((a, b) => priorityOrder[a.data.priority] - priorityOrder[b.data.priority]);
        }
        case 'createDate':
            return todosCopy.sort((a, b) => {
                const dateA = a.data.timeOfCreation ? new Date(a.data.timeOfCreation).getTime() : null;
                const dateB = b.data.timeOfCreation ? new Date(b.data.timeOfCreation).getTime() : null;

                if (dateA === null) return 1;
                if (dateB === null) return -1;
                return dateA - dateB;
            });

        case 'none':
        default:
            return todosCopy;
    }
};

export const groupTodos = (todos: TodoItemProps[], groupKey: string): Record<string, TodoItemProps[]> => {
    const groupByKey = (key: groupKey) => {
        const grouped: Record<string, TodoItemProps[]> = todos.reduce(
            (acc, item: TodoItemProps) => {
                const groupValues: string[] = [];

                if (key === 'targetDate') {
                    const now = new Date();
                    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                    if (!item.data.targetDate) {
                        groupValues.push('Без даты');
                    } else {
                        const targetDate = new Date(item.data.targetDate);
                        const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

                        if (targetDay < today) {
                            groupValues.push('Просрочено');
                        } else if (targetDay.getTime() === today.getTime()) {
                            groupValues.push('Сегодня');
                        } else {
                            const tomorrow = new Date(today);
                            tomorrow.setDate(today.getDate() + 1);
                            const next7Days = new Date(today);
                            next7Days.setDate(today.getDate() + 7);
                            const next30Days = new Date(today);
                            next30Days.setDate(today.getDate() + 30);

                            if (targetDay.getTime() === tomorrow.getTime()) {
                                groupValues.push('Завтра');
                            } else if (targetDay <= next7Days) {
                                groupValues.push('Следующие 7 дней');
                            } else if (targetDay <= next30Days) {
                                groupValues.push('Следующие 30 дней');
                            } else {
                                groupValues.push('Позже');
                            }
                        }
                    }
                } else if (key === 'none') {
                    return { '': todos };
                } else {
                    const values = Array.isArray(item.data[key]) ? item.data[key] : [item.data[key]];
                    values.forEach((value) => {
                        groupValues.push(value);
                    });
                }

                groupValues.forEach((groupValue: string) => {
                    if (!acc[groupValue]) {
                        acc[groupValue] = [];
                    }

                    acc[groupValue].push(item);
                });

                return acc;
            },
            {} as Record<string, TodoItemProps[]>,
        );

        return grouped;
    };

    switch (groupKey) {
        case 'date':
            return groupByKey('targetDate');
        case 'priority':
            return groupByKey('priority');
        case 'tag':
            return groupByKey('tags');
        case 'none':
        default:
            return groupByKey('none');
    }
};

export const groupTitle = (groupOption: string, key: string) => {
    const formatDate = (key: string) => {
        switch (key) {
            case 'Без даты':
            case 'Просрочено':
            case 'Сегодня':
            case 'Завтра':
            case 'Следующие 7 дней':
            case 'Следующие 30 дней':
            case 'Позже':
                return key;
            default:
                return 'Неизвестная группа';
        }
    };

    const groupByKeyTranslations: PriorityMap = {
        none: 'Нет',
        low: 'Низкий приоритет',
        medium: 'Средний приоритет',
        high: 'Высокий приоритет',
    };

    switch (groupOption) {
        case 'date':
            return formatDate(key);
        case 'priority':
            return groupByKeyTranslations[key] || 'Нет приоритета';
        case 'tag':
            return key === 'none' ? 'Нет меток' : key;
        case 'none':
        default:
            return '';
    }
};
