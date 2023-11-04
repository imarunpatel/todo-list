import { app, firestore } from '@/firebaseConfig';
import { getTodosGroupByColumn } from '@/lib/getTodosGroupedByColumns';
import { uploadImage } from '@/lib/uploadImage';
import { addDoc, collection, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { create } from 'zustand'

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumns) => void;
  newTaskInput: string;
  searchString: string;
  newTaskType: TypedColumns;
  image: File | null;
  setSearchString: (searchString: string) => void;
  addTask: (todo: string, columnId: TypedColumns, image?: File | null) => void;
  deleteTask: (taskIndex: number, todo: Todo, id: TypedColumns) => void;
  setNewTaskInput: (input: string) => void;
  setNewTaskType: (columnId: TypedColumns) => void;
  setImage: (image: File | null) => void;
}
export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumns, Column>()
  },
  searchString: '',
  newTaskInput: '',
  newTaskType: 'todo',
  image: null,
  setSearchString: (searchString) => set({ searchString: searchString.trim() }),
  getBoard: async () => {
    const board = await getTodosGroupByColumn();
    set({ board });
  },
  setBoardState: (board) => set({ board }),
  updateTodoInDB: async (todo, columnId) => {
    const docRef = doc(firestore, 'todos', todo.$id);

    await updateDoc(docRef, { status: columnId }).then((res) => {
      // console.log('success', res)
    })
  },
  addTask: async (todo, columnId, image) => {
    let imageUrl: string | undefined;

    if (image) {
      imageUrl =  await uploadImage(image);
    }
    console.log(imageUrl, 'url');
    let doc = {
      title: todo,
      status: columnId,
      createdAt: new Date().toDateString(),
      ...(imageUrl && { image: imageUrl })
    }
    console.log('doc');
    const docRef = await addDoc(collection(firestore, 'todos'), doc);

    set({ newTaskInput: '' })

    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id: docRef.id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        ...(image && { image: imageUrl })
      }

      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo]
        })
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }
      return {
        board: {
          columns: newColumns,
        }
      }
    })
    // Create document
  },
  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumns) => {
    const newColumns = new Map(get().board.columns);

    // delte todoId from newColumns
    newColumns.get(id)?.todos.splice(taskIndex, 1);

    set({ board: { columns: newColumns } });

    if (todo.image) {

    }
    if (todo.image) {
      // delte image from firebase storage

    }
    await deleteDoc(doc(firestore, 'todos', todo.$id))
  },
  setNewTaskInput: (input: string) => set({ newTaskInput: input }),
  setNewTaskType: (type: TypedColumns) => set({ newTaskType: type }),
  setImage: (image: File | null) => set({ image }),
}))


