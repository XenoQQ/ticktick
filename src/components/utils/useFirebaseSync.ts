import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodosFromFirebase, syncTodosWithFirebase } from '../../store/todoSlice';
import { fetchHashtagsFromFirebase, syncHashtagsWithFirebase } from '../../store/hashtagSlice';
import { AppDispatch, RootState } from '../../store/store';

const useFirebaseSync = () => {
    const dispatch = useDispatch<AppDispatch>();
    const todos = useSelector((state: RootState) => state.todos.todos);
    const hashtags = useSelector((state: RootState) => state.hashtags.tags);

    useEffect(() => {
        dispatch(fetchTodosFromFirebase());
        dispatch(fetchHashtagsFromFirebase());
    }, [dispatch]);

    useEffect(() => {
        dispatch(syncTodosWithFirebase(todos));
    }, [todos, dispatch]);

    useEffect(() => {
        dispatch(syncHashtagsWithFirebase(hashtags));
    }, [hashtags, dispatch]);
};

export default useFirebaseSync;
