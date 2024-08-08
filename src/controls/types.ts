export interface TodoItemProps {
    key: string;
    data: TodoItemData;
}

export interface TodoItemData {
    id: string;
    content: string;
    priority: 'none' | 'low' | 'medium' | 'high';
    doneStatus: boolean;
    tags: string[];
    timeOfCreation: string;
    timeOfCompletion?: string | null;
    targetDate: string | null;
    children: TodoSubItemProps[];
    isSub: boolean;
}

export interface TodoSubItemProps {
    key: string;
    data: TodoSubItemData;
}

export interface TodoSubItemData {
    id: string;
    parentId: string;
    content: string;
    priority: 'none' | 'low' | 'medium' | 'high';
    doneStatus: boolean;
    timeOfCreation: string;
    timeOfCompletion?: string | null;
    targetDate: string | null;
    isSub: boolean;
}

export type groupKey = keyof TodoItemData | 'none';

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

export interface Options {
    groupOption: GroupCase;
    sortOption: SortCase;
    showTags: boolean;
}

export type GroupCase = 'date' | 'priority' | 'tag' | 'none';

export type SortCase = 'date' | 'name' | 'tag' | 'priority' | 'createDate' | 'none';

export type TodosState = {
    todos: TodoItemProps[];
    loading: boolean;
    error: string | null;
};

export type UpdateTodoProps = {
    updateType: 'doneStatus' | 'priority' | 'content' | 'targetDate';
    id: string;
} & Partial<{ priority: 'none' | 'low' | 'medium' | 'high'; content: string; tags: string[]; targetDate: string | null }>;

export type UpdateSubTodoProps = {
    updateType: 'doneStatus' | 'priority' | 'content' | 'targetDate';
    parentId: string;
    id: string;
} & Partial<{ priority: 'none' | 'low' | 'medium' | 'high'; content: string; targetDate: string | null }>;

export interface Hashtags {
    tags: string[];
    loading: boolean;
    error: string | null;
}

export type GroupOfTodos = { key: string; title: string; items: TodoItemProps[] };

export type GroupedTodos = GroupOfTodos[];

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
    tagColor: string;
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

export interface VisibleState {
    menu: boolean;
    priorityMenu: boolean;
    datepicker: boolean;
    hashtagSettings: boolean;
}

export type VisibleStateKey = keyof VisibleState;
