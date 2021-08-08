
export const masm_builtin_pc = "counter"
export const masm_builtin_tick = "tick"

export interface TContext {
    function?: string,
    loop_break?: string,
    loop_continue?: string
}

export interface TResult {
    code: string
    result?: string
}


export interface UserFunction {
    name: string
    jump_ref: string
    return_counter: string
    args: string[]   
}

export const M_OP_MAPPING: { [key: string]: OpMode } = {
    "+": "add",
    "-": "sub",
    "*": "mul",
}
export const M_COMPOUND_OP_MAPPING: { [key: string]: OpMode } = {
    "+=": "add",
    "-=": "sub",
    "*=": "mul",
}

function m_generic(prefix: string): (...args: (string | undefined)[]) => string {
    return (...args) => prefix + " " + args.filter(a => a).join(" ") + "\n"
}

export type OpMode = "add" | "sub" | "mul" | "div" | "idiv" | "mod" | "shl" | "shr" | "noise" | "sin" | "cos" | "tan" | "atan" | "acos" | "asin" | "angle" | "len" | "rand"

export const m_set: (l: string, r: string) => string = m_generic("set")
export const m_op: (mode: OpMode, t: string, l?: string, r?: string) => string = m_generic("op")
export const m_jump: (dest: string, mode: string, a?: string, b?: string) => string = m_generic("jump")
