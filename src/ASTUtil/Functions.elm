module ASTUtil.Functions exposing (isStatic)

import AST.Types exposing (Function, FunctionSignature, TypeReference(FunctionTypeReference))


isStatic : Function -> Bool
isStatic function =
    if List.length function.declaration.arguments > 0 then
        False
    else if function.declaration.operatorDefinition then
        False
    else if Maybe.withDefault False <| Maybe.map isFunctionSignature function.signature then
        False
    else
        True


isFunctionSignature : FunctionSignature -> Bool
isFunctionSignature { typeReference } =
    isFunctionTypeReference typeReference


isFunctionTypeReference : TypeReference -> Bool
isFunctionTypeReference typeReference =
    case typeReference of
        FunctionTypeReference _ _ _ ->
            True

        _ ->
            False
