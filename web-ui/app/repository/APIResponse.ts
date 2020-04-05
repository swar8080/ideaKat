export interface APIResponse<T, ERROR_KEYS> {
    data: T,
    successful: boolean,
    errors?: Record<keyof ERROR_KEYS, string>,
    hasErrors: boolean,
    responseMessage?: string
}