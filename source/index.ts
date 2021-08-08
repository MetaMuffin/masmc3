import { spawn } from "child_process"
import { transpile } from "./transpiler";
import { AST } from "./ast";
import { resolve_jump_marks } from "./post";



export async function loadAST(filename: string): Promise<AST> {
    const clang = spawn("clang", ["-Xclang", "-ast-dump=json", filename, "-fsyntax-only", "-Wno-incompatible-library-redeclaration"], {})
    let output = ""
    clang.stdout.on("data", chunk => output += chunk)
    clang.stderr.on("data", chunk => console.error(chunk.toString()))
    await new Promise<void>(r => clang.on("exit", () => r()))
    let ast: AST = JSON.parse(output)
    return ast
}

async function main() {
    const ast = await loadAST("./input/test.c")
    // console.log(ast);
    const code = transpile({}, ast).code
    // console.log(code);
    const masm = resolve_jump_marks(code)
    console.log(masm);
}
main()

