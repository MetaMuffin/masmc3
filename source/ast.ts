

export type NodeKind = "TranslationUnitDecl"
    | "TypedefDecl"
    | "BuiltinType"
    | "RecordType"
    | "RecordDecl"
    | "PointerType"
    | "ConstantArrayType"
    | "FunctionDecl"
    | "CompoundStmt"
    | "ReturnStmt"
    | "IntegerLiteral"
    | "VarDecl"
    | "ParmVarDecl"
    | "CallExpr"
    | "DeclRefExpr"
    | "NoThrowAttr"
    | "BuiltinAttr"
    | "DeclStmt"
    | "ImplicitCastExpr"
    | "IfStmt"
    | "BinaryOperator"
    | "UnaryOperator"
    | "WhileStmt"
    | "CompoundAssignOperator"
    | "ParenExpr"

export interface AST {
    id: string
    kind: NodeKind
    name?: string
    value?: string

    inner?: AST[]

    isPostfix?: boolean,
    opcode?: string
    loc?: {
        offset: number
        file: string
        line: number
        col: number
        tokLen: number
    }
    range?: {
        begin: {
            offset: number
            col: number
            tokLen: number
        },
        end: {
            offset: number
            col: number
            line: number
            tokLen: number
        }
    }
    isImplicit?: boolean
    implicit?: boolean
    type?: {
        qualType?: string
    }
    valueCategory?: string
    mangledName?: string
    storageClass?: "extern"
    referencedDecl?: AST
}
