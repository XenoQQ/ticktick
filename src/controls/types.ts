export interface TodoItemProps {
    key: string;
    data: {
        id: string;
        content: string;
        priority: 'none' | 'low' | 'medium' | 'high';
        doneStatus: boolean;
        tags: string[];
        timeOfCreation: string;
        timeOfCompletion?: string | null;
        targetDate: string | null;
        type: string;
        parentId: string | null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    };
}

export interface PriorityMap {
    none: string;
    low: string;
    medium: string;
    high: string;
    [key: string]: string;
}

export interface DateProps {
    onChange?: (date: Date | null) => void;
    value?: Date | null;
}

export interface PriorityMenuProps {
    onSelect: (priority: 'none' | 'low' | 'medium' | 'high') => void;
    onClose: () => void;
}

export interface TitleMap {
    date: string;
    priority: string;
    tag: string;
    none: string;
    [key: string]: string;
}

export type VisibleCaseState = {
    CaseContainerVisible: boolean;
    groupVisible: boolean;
    sortVisible: boolean;
};
export type VisibleCase = 'CaseContainerVisible' | 'groupVisible' | 'sortVisible';

export type GroupCase = 'date' | 'priority' | 'tag' | 'none';

export type SortCase = 'date' | 'name' | 'tag' | 'priority' | 'none';

export type TodosState = {
    todos: TodoItemProps[];
    loading: boolean;
    error: string | null;
};

export type SwitchPriority = {
    id: string;
    priority: 'none' | 'low' | 'medium' | 'high';
};

export type SwitchContent = {
    id: string;
    content: string;
};
