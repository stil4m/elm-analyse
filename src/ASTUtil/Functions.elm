module ASTUtil.Functions exposing (isStatic)

import Elm.Syntax.Expression exposing (Function)
import Elm.Syntax.Node as Node
import Elm.Syntax.Signature exposing (Signature)
import Elm.Syntax.TypeAnnotation exposing (TypeAnnotation(..))


isStatic : Function -> Bool
isStatic function =
    let
        decl =
            Node.value function.declaration
    in
    if List.length decl.arguments > 0 then
        False

    else if Maybe.withDefault False <| Maybe.map (Node.value >> isFunctionSignature) function.signature then
        False

    else
        True


isFunctionSignature : Signature -> Bool
isFunctionSignature { typeAnnotation } =
    isFunctionTypeAnnotation (Node.value typeAnnotation)


isFunctionTypeAnnotation : TypeAnnotation -> Bool
isFunctionTypeAnnotation typeAnnotation =
    case typeAnnotation of
        FunctionTypeAnnotation _ _ ->
            True

        _ ->
            False
