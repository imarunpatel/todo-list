'use client'

import { useBoardStore } from '@/store/BoardStore';
import { XCircleIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import React from 'react'
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from 'react-beautiful-dnd';

interface Props {
    todo: Todo;
    index: number;
    id: TypedColumns;
    innerRef: (element: HTMLElement | null) => void;
    draggableProps: DraggableProvidedDraggableProps ;
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}
const TodoCard = ({todo, index, id, innerRef, draggableProps, dragHandleProps}: Props) => {
    const deleteTask = useBoardStore((state) => state.deleteTask);

  return (
    <div
        className='bg-white rounded-sm space-y-2 drop-shadow-md'
        {...draggableProps}
        {...dragHandleProps}
        ref={innerRef}
    >
        <div className='flex justify-between items-center p-5'>
            <p>{todo.title}</p>
            <button onClick={() => deleteTask(index, todo, id)} className='text-red-500 hover:text-red-600'>
                <XCircleIcon className='ml-5 h-8 w-8' />
            </button>
        </div>

        {todo.image && (
            <div className='h-full w-full rounded-b-md'>
                <Image src={todo.image} alt="Task image" width={400} height={200} priority={true} className='w-full object-contain rounded-b-md' />
            </div>
        )}
    </div>
  )
}

export default TodoCard