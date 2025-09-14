import {
    DndContext,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent
} from "@dnd-kit/core"

import type { Project, Task, TaskProjectSchema } from "@/types/index"
import { statusTranslations } from "@/locales/es"
import TaskCard from "./TaskCard"
import DropTask from "./DropTask"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateStatus } from "@/api/TaskApi"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"

type TaskListProps = {
    tasks: TaskProjectSchema[]
    canEdit: boolean
}

type GroupedTasks = {
    [key: string]: TaskProjectSchema[]
}
const initialStatusGroups: GroupedTasks = {
    pending: [],
    onHold: [],
    inProgress: [],
    underReview: [],
    completed: [],
}

export default function TaskList({ tasks, canEdit }: TaskListProps) {
    const params = useParams()
    const projectId = params.projectId!
    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: updateStatus,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['project', projectId] })
            // queryClient.invalidateQueries({ queryKey: ['task', taskId] })

        }
    })

    const groupedTasks = tasks.reduce((acc, task) => {

        return { ...acc, [task.status]: acc[task.status] ? [...acc[task.status], task] : [task] }
    }, initialStatusGroups);


    const statusColors: { [key: string]: string } = {
        pending: 'border-t-slate-500',
        onHold: 'border-t-red-500',
        inProgress: 'border-t-blue-500',
        underReview: 'border-t-amber-500',
        completed: 'border-t-emerald-500',
    }



    const handleDragEnd = (e: DragEndEvent) => {
        const { over, active } = e

        if (over && over.id) {
            const taskId = active.id.toString()
            const status = over.id as Task['status']

            mutate({ projectId, taskId, status })

            queryClient.setQueryData(['project', projectId], (prevData: Project) => {
                const updatedTask = prevData.tasks.map((task) => {
                    if (task._id === taskId) {
                        return {
                            ...task,
                            status
                        }
                    }
                    return task
                })

                return {
                    ...prevData,
                    tasks: updatedTask
                }
            })
        }
    }

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });

    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 250,
            tolerance: 5,
        },
    });
    const sensors = useSensors(mouseSensor, touchSensor);
    return (

        <>
            <h2 className="text-5xl font-black my-10">Tareas</h2>

            <div
                className='flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32'>
                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    {Object.entries(groupedTasks).map(([status, tasks]) => (
                        <div key={status} className='min-w-[300px] 2xl:min-w-0 2xl:w-1/5'>
                            <h3
                                className={`capitalize text-x font-light border-t ${statusColors[status]} bg-white p-3 border-t-8`}
                            >{statusTranslations[status]}</h3>
                            <DropTask status={status} />
                            <ul
                                className='mt-5 space-y-5'>
                                {tasks.length === 0 ? (
                                    <li className="text-gray-500 text-center pt-3">No Hay tareas</li>
                                ) : (
                                    tasks.map(task => <TaskCard key={task._id} task={task} canEdit={canEdit} />)
                                )}
                            </ul>
                        </div>
                    ))}
                </DndContext>

            </div>

        </>
    )
}
