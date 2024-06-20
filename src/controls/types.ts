export interface TodoItemProps {
    key: string;
    data: {
        id: string;
        content: string;
        priority: "none" | "low" | "medium" | "high";
        doneStatus: boolean;
        tags: string[];
        timeOfCreation: Date;
        timeOfCompletion?: Date;
        targetDate: Date;
        type: string;
        childrenKeys: string[];
    };
}