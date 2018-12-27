module Analyser.Checks.Variables exposing (UsedVariableContext, collect, unusedTopLevels, unusedVariables)

import ASTUtil.Inspector as Inspector exposing (Order(..), defaultConfig)
import ASTUtil.Variables exposing (VariableType(..), getLetDeclarationsVars, getTopLevels, patternToUsedVars, patternToVars, patternToVarsInner, withoutTopLevel)
import Analyser.FileContext exposing (FileContext)
import Dict exposing (Dict)
import Elm.Syntax.Expression exposing (Case, Expression(..), Function, Lambda, LetBlock, RecordSetter)
import Elm.Syntax.File exposing (File)
import Elm.Syntax.Infix exposing (InfixDirection)
import Elm.Syntax.ModuleName exposing (ModuleName)
import Elm.Syntax.Node as Node exposing (Node(..))
import Elm.Syntax.Pattern exposing (Pattern(..))
import Elm.Syntax.Range exposing (Range)
import Elm.Syntax.TypeAnnotation exposing (TypeAnnotation(..))
import Tuple.Extra


type alias Scope =
    Dict String ( Int, VariableType, Range )


type alias ActiveScope =
    ( List String, Scope )


type UsedVariableContext
    = UsedVariableContext InneUsedVariableContext


type alias InneUsedVariableContext =
    { poppedScopes : List Scope
    , activeScopes : List ActiveScope
    }


unusedVariables : UsedVariableContext -> List ( String, VariableType, Range )
unusedVariables (UsedVariableContext x) =
    x.poppedScopes
        |> List.concatMap Dict.toList
        |> onlyUnused
        |> List.map (\( a, ( _, c, d ) ) -> ( a, c, d ))


unusedTopLevels : UsedVariableContext -> List ( String, VariableType, Range )
unusedTopLevels (UsedVariableContext x) =
    x.activeScopes
        |> List.head
        |> Maybe.map Tuple.second
        |> Maybe.withDefault Dict.empty
        |> Dict.toList
        |> onlyUnused
        |> List.map (\( a, ( _, c, d ) ) -> ( a, c, d ))


onlyUnused : List ( String, ( Int, VariableType, Range ) ) -> List ( String, ( Int, VariableType, Range ) )
onlyUnused =
    List.filter (Tuple.second >> Tuple.Extra.first3 >> (==) 0)


collect : FileContext -> UsedVariableContext
collect fileContext =
    UsedVariableContext <|
        Inspector.inspect
            { defaultConfig
                | onFile = Pre onFile
                , onFunction = Inner onFunction
                , onLetBlock = Inner onLetBlock
                , onLambda = Inner onLambda
                , onCase = Inner onCase
                , onOperatorApplication = Post onOperatorAppliction
                , onDestructuring = Post onDestructuring
                , onFunctionOrValue = Post onFunctionOrValue
                , onPrefixOperator = Post onPrefixOperator
                , onRecordUpdate = Post onRecordUpdate
                , onTypeAnnotation = Post onTypeAnnotation
            }
            fileContext.ast
            emptyContext


emptyContext : InneUsedVariableContext
emptyContext =
    { poppedScopes = [], activeScopes = [] }


addUsedVariable : String -> InneUsedVariableContext -> InneUsedVariableContext
addUsedVariable x context =
    { context | activeScopes = flagVariable x context.activeScopes }


popScope : InneUsedVariableContext -> InneUsedVariableContext
popScope x =
    { x
        | activeScopes = List.drop 1 x.activeScopes
        , poppedScopes =
            List.head x.activeScopes
                |> Maybe.map
                    (\( _, activeScope ) ->
                        if Dict.isEmpty activeScope then
                            x.poppedScopes

                        else
                            activeScope :: x.poppedScopes
                    )
                |> Maybe.withDefault x.poppedScopes
    }


pushScope : List ( Node String, VariableType ) -> InneUsedVariableContext -> InneUsedVariableContext
pushScope vars x =
    let
        y : ActiveScope
        y =
            vars
                |> List.map (\( z, t ) -> ( Node.value z, ( 0, t, Node.range z ) ))
                |> Dict.fromList
                |> (\b -> ( [], b ))
    in
    { x | activeScopes = y :: x.activeScopes }


unMaskVariable : String -> InneUsedVariableContext -> InneUsedVariableContext
unMaskVariable k context =
    { context
        | activeScopes =
            case context.activeScopes of
                [] ->
                    []

                ( masked, vs ) :: xs ->
                    ( List.filter ((/=) k) masked, vs ) :: xs
    }


maskVariable : String -> InneUsedVariableContext -> InneUsedVariableContext
maskVariable k context =
    { context
        | activeScopes =
            case context.activeScopes of
                [] ->
                    []

                ( masked, vs ) :: xs ->
                    ( k :: masked, vs ) :: xs
    }


flagVariable : String -> List ActiveScope -> List ActiveScope
flagVariable k l =
    case l of
        [] ->
            []

        ( masked, x ) :: xs ->
            if List.member k masked then
                ( masked, x ) :: xs

            else if Dict.member k x then
                ( masked, Dict.update k (Maybe.map (Tuple.Extra.mapFirst3 ((+) 1))) x ) :: xs

            else
                ( masked, x ) :: flagVariable k xs


onFunctionOrValue : ( ModuleName, String ) -> InneUsedVariableContext -> InneUsedVariableContext
onFunctionOrValue ( _, x ) context =
    addUsedVariable x context


onPrefixOperator : String -> InneUsedVariableContext -> InneUsedVariableContext
onPrefixOperator prefixOperator context =
    addUsedVariable prefixOperator context


onRecordUpdate : ( Node String, List (Node RecordSetter) ) -> InneUsedVariableContext -> InneUsedVariableContext
onRecordUpdate ( Node _ name, _ ) context =
    addUsedVariable name context


onOperatorAppliction : { operator : String, direction : InfixDirection, left : Node Expression, right : Node Expression } -> InneUsedVariableContext -> InneUsedVariableContext
onOperatorAppliction { operator } context =
    addUsedVariable operator context


onFile : File -> InneUsedVariableContext -> InneUsedVariableContext
onFile file context =
    getTopLevels file
        |> (\a -> pushScope a context)


onFunction : (InneUsedVariableContext -> InneUsedVariableContext) -> Node Function -> InneUsedVariableContext -> InneUsedVariableContext
onFunction f (Node _ function) context =
    let
        functionDeclaration =
            Node.value function.declaration

        used =
            List.concatMap patternToUsedVars functionDeclaration.arguments
                |> List.map Node.value

        postContext =
            context
                |> maskVariable (Node.value functionDeclaration.name)
                |> (\c ->
                        functionDeclaration.arguments
                            |> List.concatMap patternToVars
                            |> (\a -> pushScope a c)
                            |> f
                            |> popScope
                            |> unMaskVariable (Node.value functionDeclaration.name)
                   )
    in
    List.foldl addUsedVariable postContext used


onLambda : (InneUsedVariableContext -> InneUsedVariableContext) -> Lambda -> InneUsedVariableContext -> InneUsedVariableContext
onLambda f lambda context =
    let
        preContext =
            lambda.args
                |> List.concatMap patternToVars
                |> (\a -> pushScope a context)

        postContext =
            f preContext
    in
    postContext |> popScope


onLetBlock : (InneUsedVariableContext -> InneUsedVariableContext) -> LetBlock -> InneUsedVariableContext -> InneUsedVariableContext
onLetBlock f letBlock context =
    letBlock.declarations
        |> (getLetDeclarationsVars >> withoutTopLevel)
        |> (\a -> pushScope a context)
        |> f
        |> popScope


onDestructuring : ( Node Pattern, Node Expression ) -> InneUsedVariableContext -> InneUsedVariableContext
onDestructuring ( pattern, _ ) context =
    List.foldl addUsedVariable
        context
        (List.map Node.value (patternToUsedVars pattern))


onCase : (InneUsedVariableContext -> InneUsedVariableContext) -> Case -> InneUsedVariableContext -> InneUsedVariableContext
onCase f caze context =
    let
        used =
            patternToUsedVars (Tuple.first caze) |> List.map Node.value

        postContext =
            Tuple.first caze
                |> patternToVarsInner False
                |> (\a -> pushScope a context)
                |> f
                |> popScope
    in
    List.foldl addUsedVariable postContext used


onTypeAnnotation : Node TypeAnnotation -> InneUsedVariableContext -> InneUsedVariableContext
onTypeAnnotation (Node _ t) c =
    case t of
        Typed (Node _ ( [], name )) _ ->
            addUsedVariable name c

        _ ->
            c
