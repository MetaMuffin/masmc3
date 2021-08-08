import { NodeKind, AST } from "./ast";
import { BUILTIN_FUNCTIONS } from "./builtin";
import { create_tagged_mark, temp_var } from "./helper";
import { masm_builtin_pc, M_COMPOUND_OP_MAPPING, m_jump, m_op, M_OP_MAPPING, m_set, TContext, TResult, UserFunction } from "./masm";

export const user_functions: Map<string, UserFunction> = new Map()

export function transpile(ctx: TContext, node: AST): TResult {
    const transpile_nth_inner = (i: number) => {
        if (!node.inner) throw new Error("aaaaaaahjhgfasjd");
        const k = node.inner[i]
        if (!k) throw new Error("asdfhasdkjf");
        return transpile(ctx, k)
    }
    const transpile_first_inner = () => transpile_nth_inner(0)

    if (node.implicit) return { code: "" }
    const V: { [key in NodeKind]?: () => TResult } = {
        TranslationUnitDecl: () => {
            if (!node.inner) throw new Error("asdfas");
            return {
                code: node.inner.map(n => transpile(ctx, n).code).join("")
            }
        },
        CompoundStmt: () => {
            if (!node.inner) return { code: "" }
            return {
                code: node.inner.map(n => transpile(ctx, n).code).join("")
            }
        },
        TypedefDecl: () => ({ code: "" }),
        RecordDecl: () => ({ code: "" }),
        FunctionDecl: () => {
            if (!node.inner) throw new Error("dsafhsdfjk");
            if (!node.inner.reduce((a, v) => a || (v.kind == "CompoundStmt"), false)) return { code: "" }
            return transpile({ ...ctx, function: node.name }, node.inner.filter(n => n.kind == "CompoundStmt")[0])
        },
        VarDecl: () => {
            if (node.storageClass == "extern") return { code: "" }
            if (!node.name) throw new Error("qwiuezrsdfbajdl");
            const r = transpile_first_inner()
            if (!r.result) throw new Error("aeroiudfhjk");
            return {
                code: r.code + m_set(node.name, r.result),
                result: node.name
            }
        },
        DeclStmt: transpile_first_inner,
        ImplicitCastExpr: transpile_first_inner,
        IntegerLiteral: () => {
            return { code: "", result: node.value ?? "0" }
        },

        IfStmt: () => {
            const condition = transpile_nth_inner(0)
            const body = transpile_nth_inner(1)
            const skip_mark = create_tagged_mark("skip_if_body")
            return {
                code: condition.code
                    + m_jump(skip_mark.ref, "not", condition.result, "1")
                    + body.code
                    + skip_mark.decl
            }
        },
        WhileStmt: () => {
            const condition = transpile_nth_inner(0)
            const body = transpile_nth_inner(1)
            const top_mark = create_tagged_mark("while_top")
            const break_mark = create_tagged_mark("while_break")
            return {
                code: top_mark.decl
                    + condition.code
                    + m_jump(break_mark.ref, "not", condition.result, "1")
                    + body.code
                    + m_jump(top_mark.ref, "always")
                    + break_mark.decl
            }
        },

        DeclRefExpr: () => {
            if (!node.referencedDecl) throw new Error("sadfhjksldfh");
            if (!node.referencedDecl.name) throw new Error("sadfhjksldfhadsfsd");
            return { code: "", result: node.referencedDecl.name }
        },
        BinaryOperator: () => {
            if (!node.opcode) throw new Error("asfdjashdgfkjlshdfljk");
            if (node.opcode == "=" && node.inner && node.inner[0].kind != "DeclRefExpr") throw new Error("sadfhjkasdhfjks");
            const l = transpile_nth_inner(0)
            const r = transpile_nth_inner(1)
            if (!l.result) throw new Error("iweauriosdhfgkj");
            if (!r.result) throw new Error("saduifzuwezrjsdf");
            if (l.code.length) throw new Error("ohnononononono");
            if (node.opcode == "=") return { code: m_set(l.result, r.result), result: l.result }
            const target = temp_var()
            return {
                code: r.code + m_op(M_OP_MAPPING[node.opcode], target, l.result, r.result),
                result: target
            }
        },
        CompoundAssignOperator: () => {
            if (!node.opcode) throw new Error("asfdjashdgfkjlshdfljk");
            if (node.opcode == "=" && node.inner && node.inner[0].kind != "DeclRefExpr") throw new Error("sadfhjkasdhfjks");
            const l = transpile_nth_inner(0)
            const r = transpile_nth_inner(1)
            if (!l.result) throw new Error("iweauriosdhfgkj");
            if (!r.result) throw new Error("saduifzuwezrjsdf");
            if (l.code.length) throw new Error("ohnononononono");
            return {
                code: r.code + m_op(M_COMPOUND_OP_MAPPING[node.opcode], l.result, l.result, r.result)
            }
        },

        CallExpr: () => {
            if (!node.inner) throw new Error("sadhfjahsdkjfaa");
            const func = transpile_nth_inner(0).result ?? "aaaaaaaaaa"
            const args = node.inner.slice(1).map(n => transpile(ctx, n))
            const args_values = args.map(a => a.result ?? "aaaaaaaaa")
            const args_code = args.reduce((a, v) => a + v.code, "")

            const builtin = BUILTIN_FUNCTIONS[func]
            let call
            if (builtin) {
                call = builtin(...args_values)
            } else {
                const f = user_functions.get(func)
                if (!f) throw new Error("unknown user function " + func);

                call = m_op("add", f.return_counter, masm_builtin_pc, "2")
                    + m_jump(f.jump_ref, "always")
            }
            return {
                code: args_code + call,
                result: "__return"
            }
        }
    }

    const t = V[node.kind]
    if (!t) {
        console.error(node)
        throw new Error("unknown node kind: " + node.kind);
    }
    return t()
}

export function flatten<T>(a: T[][]): T[] {
    let b = [];
    for (const c of a) {
        b.push(...c)
    }
    return b
}