
export function resolve_jump_marks(input: string): string {
    let k = input.split("\n")
    let decls: { [key: string]: number } = {}
    for (let i = 0; i < k.length; i++) {
        while (k[i].startsWith("@")) {
            const mark = k[i].split(" ")[0].substr(1)
            decls[mark] = i
            k[i] = k[i].split(" ").slice(1).join(" ")
        }
    }
    for (let i = 0; i < k.length; i++) {
        k[i] = k[i].replace(/'[_\w]+($| )/g, (match, index, orig) => {
            const decl = decls[match.trim().substr(1)]
            if (!decl) throw new Error("unknown jump mark reference: " + match);
            return decl.toString() + " "
        })
    }
    return k.join("\n") + "end\n"
}
