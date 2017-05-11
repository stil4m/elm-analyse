module ASTUtil.Functions exposing (isStatic)

import Elm.Syntax.TypeAnnotation exposing (..)
import Elm.Syntax.Expression exposing (..)


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
isFunctionSignature { typeAnnotation } =
    isFunctionTypeAnnotation typeAnnotation


isFunctionTypeAnnotation : TypeAnnotation -> Bool
isFunctionTypeAnnotation typeAnnotation =
    case typeAnnotation of
        FunctionTypeAnnotation _ _ _ ->
            True

        _ ->
            False
