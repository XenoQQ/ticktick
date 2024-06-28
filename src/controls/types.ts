export interface TodoItemProps {
    key: string;
    data: {
        id: string;
        content: string;
        priority: "none" | "low" | "medium" | "high";
        doneStatus: boolean;
        tags: string[];
        timeOfCreation: string;
        timeOfCompletion?: string | null;
        targetDate: string | null;
        type: string;
        childrenKeys: string[];
    };
}