import z from "zod";

/* Auth & Users */

/* Registrar */
const authSchema = z.object({
    name: z.string(),
    email: (
        z.string(),
        z.email()
    ),
    current_password: z.string(),
    password: z.string(),
    password_confirmation: z.string(),
    token: z.string()
})

type Auth = z.infer<typeof authSchema>
/* Iniciar sesión form */
export type UserLoginForm = Pick<Auth, 'email' | 'password'>
export type UserRegistrationForm = Pick<Auth, 'name' | 'email' | 'password' | 'password_confirmation'>
export type RequestConfirmationCodeForm = Pick<Auth, 'email'>
export type ForgotPasswordForm = Pick<Auth, 'email'>
export type NewPasswordForm = Pick<Auth, 'password' | 'password_confirmation'>
export type UpdateCurrentUserPasswordForm = Pick<Auth, 'current_password' | 'password' | 'password_confirmation'>
export type CheckPasswordForm = Pick<Auth, 'password'>

export type ConfirmToken = Pick<Auth, 'token'>

/* Users */
export const userSchema = authSchema.pick({
    name: true,
    email: true
}).extend({
    _id: z.string()
})

export type User = z.infer<typeof userSchema>
export type UserProfileForm = Pick<User, 'email' | 'name'>

/** NOTES */
const NoteSchema = z.object({
    _id: z.string(),
    content: z.string(),
    createdBy: userSchema,
    task: z.string(),
    createdAt: z.string()
})

export type Note = z.infer<typeof NoteSchema>
export type NoteFormData = Pick<Note, 'content'>

//** TASKS */
export const taskStatusSchema = z.enum(["pending", "onHold", "inProgress", "underReview", "completed"])
export type TaskStatus = z.infer<typeof taskStatusSchema>

export const taskSchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    project: z.string(),
    status: taskStatusSchema,
    completedBy: z.array(z.object({
        _id: z.string(),
        user: userSchema,
        status: taskStatusSchema
    })),
    notes: z.array(NoteSchema),
    createdAt: z.string(),
    updatedAt: z.string()
})

export const taskProjectSchema = taskSchema.pick({
    _id: true,
    name: true,
    description: true,
    status: true
})

export type Task = z.infer<typeof taskSchema>
export type TaskFormData = Pick<Task, 'name' | 'description'>
export type TaskProjectSchema = z.infer<typeof taskProjectSchema>
/* Project */

export const projectSchema = z.object({
    _id: z.string(),
    projectName: z.string(),
    clientName: z.string(),
    description: z.string(),
    manager: z.string(),
    tasks: z.array(taskProjectSchema),
    team: z.array((userSchema.pick({ _id: true })))
})

export const dashboardProjectSchema = z.array(
    projectSchema.pick({
        _id: true,
        projectName: true,
        clientName: true,
        description: true,
        manager: true
    })
)

export const editProjectSchema = projectSchema.pick({
    projectName: true,
    description: true,
    clientName: true
})

export type Project = z.infer<typeof projectSchema>
export type ProjectFormData = Pick<Project, 'projectName' | 'clientName' | 'description'>

/** Team */

const teamMemberSchema = userSchema.pick({
    _id: true,
    name: true,
    email: true
})

export const TeamMembersSchema = z.array(teamMemberSchema)

export type TeamMember = z.infer<typeof teamMemberSchema>
export type TeamMemberForm = Pick<TeamMember, 'email'>