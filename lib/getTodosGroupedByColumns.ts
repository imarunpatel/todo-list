import { collection, getDocs } from 'firebase/firestore';
import {  firestore } from '../firebaseConfig';

export const getTodosGroupByColumn = async () => {
    const querySnapshot = await getDocs(collection(firestore, "todos"));
    let tempDotos: Todo[] = new Array();
    querySnapshot.forEach((doc) => {
        tempDotos.push({
            $id: doc.id,
            $createdAt: doc.data().createdAt,
            status: doc.data().status,
            title: doc.data().title,
            image: doc.data().image
        });
    });

    const columns = tempDotos.reduce((acc, todo) => {
        if(!acc.get(todo.status)) {
            acc.set(todo.status, {
                id: todo.status,
                todos: []
            })
        }

        acc.get(todo.status)?.todos.push({
            $id: todo.$id,
            $createdAt: todo.$createdAt,
            title: todo.title,
            status: todo.status,
            ...(todo.image && { image: todo.image })
        })
        return acc;
    }, new Map<TypedColumns, Column>);

    const columnTypes: TypedColumns[] = ['todo', 'inprogress', 'done'];

    for(const columnType of columnTypes) {
        if(!columns.get(columnType)) {
            columns.set(columnType, {
                id: columnType,
                todos: []
            })
        }
    }

    const sortedColumns = new Map(
        Array.from(columns.entries()).sort((a, b) => (
            columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
        ))
    )

    const board: Board = {
        columns: sortedColumns
    }

    return board;
}