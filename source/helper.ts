
export interface JumpMark {
    ref: string,
    decl: string,
}

let jm_counter = 0
export function create_jump_mark(name?: string): JumpMark {
    return { decl: `@${name ?? `mark${jm_counter}`} `, ref: `'${name ?? `mark${jm_counter++}`}` }
}

export function create_tagged_mark(tag: string): JumpMark {
    return create_jump_mark(tag + (jm_counter++))
}

let tv_counter = 0;
export function temp_var() {
    return `__t${tv_counter++}`
}

export function snake_to_camel(a: string): string {
    let b = "", u = false
    for (let c of a) {
        if (c == "_") u = true
        else {
            if (u) b += c.toUpperCase()
            else b += c.toLowerCase()
            u = false
        }
    }
    return b
}
