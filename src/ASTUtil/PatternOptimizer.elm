module ASTUtil.PatternOptimizer exposing (optimize)

import Elm.Syntax.Node as Node exposing (Node(..))
import Elm.Syntax.Pattern exposing (Pattern(..))
import Elm.Syntax.Range exposing (Range)


emptyRange : Range
emptyRange =
    { start = { row = 0, column = 0 }, end = { row = 0, column = 0 } }


isAllPattern : Node Pattern -> Bool
isAllPattern p =
    case Node.value p of
        AllPattern ->
            True

        _ ->
            False


optimize : Range -> Node Pattern -> Node Pattern
optimize range ((Node r pattern) as input) =
    if r == range then
        Node emptyRange AllPattern

    else
        case pattern of
            TuplePattern xs ->
                let
                    cleaned =
                        List.map (optimize range) xs
                in
                if List.all isAllPattern cleaned then
                    Node emptyRange AllPattern

                else
                    Node r <| TuplePattern cleaned

            RecordPattern inner ->
                let
                    cleaned =
                        List.filter (Node.range >> (/=) range) inner
                in
                case cleaned of
                    [] ->
                        Node emptyRange AllPattern

                    xs ->
                        Node r <| RecordPattern xs

            UnConsPattern left right ->
                Node r <| UnConsPattern (optimize range left) (optimize range right)

            ListPattern xs ->
                Node r <| ListPattern (List.map (optimize range) xs)

            NamedPattern qnr inner ->
                Node r <| NamedPattern qnr (List.map (optimize range) inner)

            AsPattern subPattern asPointer ->
                if Node.range asPointer == range then
                    subPattern

                else
                    case optimize range subPattern of
                        Node _ AllPattern ->
                            Node (Node.range asPointer) <| VarPattern <| Node.value asPointer

                        other ->
                            Node r <| AsPattern other asPointer

            ParenthesizedPattern inner ->
                Node r <| ParenthesizedPattern (optimize range inner)

            VarPattern _ ->
                input

            AllPattern ->
                input

            UnitPattern ->
                input

            CharPattern _ ->
                input

            StringPattern _ ->
                input

            IntPattern _ ->
                input

            HexPattern _ ->
                input

            FloatPattern _ ->
                input
