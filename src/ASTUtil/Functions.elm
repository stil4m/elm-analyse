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

    else
        Maybe.withDefault True <|
            Maybe.map (Node.value >> isFunctionSignature >> not) function.signature


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
