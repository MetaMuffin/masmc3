import { snake_to_camel } from "./helper";
import { masm_builtin_pc, masm_builtin_this, masm_builtin_tick, masm_builtin_time, TResult } from "./masm";


export function builtin_default(command: string): (...args: string[]) => [boolean, string] {
    return (...args) => {
        return [command.search("__return") != -1, command + " " + args.join(" ") + "\n"]
    }
}

export function builtin_constant(name: string): string | undefined {
    if (name == "null") return "null"
    if (name == "thing_null") return "null"
    if (name == "true") return "1"
    if (name == "false") return "0"
    if (name.toUpperCase() != name) return
    if (name == "C_TICK") return masm_builtin_tick
    if (name == "C_TIME") return masm_builtin_time
    if (name == "C_COUNTER") return masm_builtin_pc
    if (name == "C_THIS") return masm_builtin_this
    if (!"UPFI".split("").includes(name[0])) return
    if (name[1] != "_") return
    return "@" + snake_to_camel(name.substr(2))
}

export const BUILTIN_FUNCTIONS: { [key: string]: (...args: string[]) => [boolean, string] } = {
    sensor: builtin_default("sensor __return"),

    control_enabled: builtin_default("control enabled"),
    control_shoot: builtin_default("control shoot"),
    control_color: builtin_default("control color"),
    control_shootp: builtin_default("control shootp"),

    draw_clear: builtin_default("draw clear"),
    draw_color: builtin_default("draw color"),
    draw_stroke: builtin_default("draw stroke"),
    draw_rect: builtin_default("draw rect"),
    draw_line_rect: builtin_default("draw lineRect"),
    draw_poly: builtin_default("draw poly"),
    draw_line_poly: builtin_default("draw linePoly"),
    draw_triange: builtin_default("draw triangle"),
    draw_image: builtin_default("draw image"),
    draw_flush: builtin_default("drawflush"),

    print: builtin_default("print"),
    print_flush: builtin_default("printflush"),

    get_link: builtin_default("getlink __return"),

    read: builtin_default("read __return"),
    write: builtin_default("write"),

    radar_player: (from, order) => [true, `radar player any any distance ${from} ${order} __return\n`]
}


