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
        childrenKeys: string[];
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

//datepicker.tsx

export interface DateProps {
    onChange?: (date: Date | null) => void;
    value?: Date | null;
}

// Todotoolbar.tsx

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
