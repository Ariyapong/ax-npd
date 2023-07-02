import { useEffect, useRef, useState } from 'react'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12)
export const getId = () => nanoid()

export const deepClone = (obj: any) => structuredClone(obj)

export const usePrevious = <T>(value: T): Optional<T> => {
    const ref = useRef<Optional<T>>()
    useEffect(() => {
        ref.current = value //assign the value of ref to the argument
    }, [value]) //this code will run when the value of 'value' changes
    return ref.current //in the end, return the current ref value.
}

export const useDebounce = <T>(value: T, delay?: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay || 500)
        return () => {
            clearTimeout(timer)
        }
    }, [value, delay])
    return debouncedValue
}
