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
    onChange: (date: Date | null) => void;
    value: Date | null;
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
    optionsWrapperVisible: boolean;
    groupWrapperVisible: boolean;
    sortWrapperVisible: boolean;
};
export type VisibleCase = 'optionsButtonClick' | 'groupButtonClick' | 'sortButtonClick';

export type GroupCase = 'date' | 'priority' | 'tag' | 'none';

export type SortCase = 'date' | 'name' | 'tag' | 'priority' | 'createDate' | 'none';

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
    tags: string[];
};

export type SwitchTargetDate = {
    id: string;
    targetDate: string | null;
};

export interface Hashtags {
    tags: string[];
    loading: boolean;
    error: string | null;
}

///// Theme

export interface Colors {
    noPriority: string;
    lowPriority: string;
    mediumPriority: string;
    highPriority: string;
    backgroundColor: string;
    activeTextColor: string;
    uiTextColor: string;
    defaultBorder: string;
    activeButtonBackground: string;
}

export interface BoxShadow {
    default: string;
    activeButton: string;
}

export interface Typography {
    FontFamily: string;
}

export interface Theme {
    colors: Colors;
    boxShadow: BoxShadow;
    typography: Typography;
}

export interface HashtagsProps {
    id: string | null;
    hashtags: string[] | null;
}
