module ASTUtil.Writer exposing (Writer, write, breaked, epsilon, parensComma, spaced, string, maybe, indent, bracesComma, sepBy, sepByComma, bracketsComma, sepBySpace, join, append)

import AST.Ranges exposing (Range)
import List.Extra as List


type alias Writer =
    Node


type Node
    = Sep ( String, String, String ) (List ( Range, Node ))
    | Breaked (List Node)
    | Str String
    | Append Node Node
    | Indent Int Node
    | Spaced (List Node)
    | Joined (List Node)


asIndent : Int -> String
asIndent =
    flip String.repeat " "


write : Writer -> String
write =
    writeIndented 0


writeIndented : Int -> Writer -> String
writeIndented indent w =
    case w of
        Sep ( pre, sep, post ) items ->
            let
                differentLines =
                    startOnDifferentLines (List.map Tuple.first items)

                seperator =
                    if differentLines then
                        "\n" ++ asIndent indent ++ sep
                    else
                        sep
            in
                String.concat
                    [ pre
                    , String.join seperator
                        (List.map (Tuple.second >> writeIndented indent) items)
                    , post
                    ]

        Breaked items ->
            --TODO INDENT
            String.join ("\n" ++ asIndent indent) (List.map (writeIndented indent) items)

        Str s ->
            s

        Indent n next ->
            asIndent (n + indent) ++ writeIndented (n + indent) next

        Spaced items ->
            String.join " " (List.map (writeIndented indent) items)

        Joined items ->
            String.concat (List.map (writeIndented indent) items)

        Append x y ->
            writeIndented indent x ++ writeIndented indent y


startOnDifferentLines : List Range -> Bool
startOnDifferentLines xs =
    List.length (List.unique (List.map (.start >> .row) xs)) > 1


indent : Int -> Writer -> Writer
indent =
    Indent


breaked : List Writer -> Writer
breaked =
    Breaked


epsilon : Writer
epsilon =
    Str ""


spaced : List Node -> Node
spaced =
    Spaced


string : String -> Node
string =
    Str


maybe : Maybe Writer -> Node
maybe =
    Maybe.withDefault epsilon


parensComma : List ( Range, Node ) -> Node
parensComma =
    Sep ( "(", ", ", ")" )


bracesComma : List ( Range, Node ) -> Node
bracesComma =
    Sep ( "{", ", ", "}" )


bracketsComma : List ( Range, Node ) -> Node
bracketsComma =
    Sep ( "[", ", ", "]" )


sepByComma : List ( Range, Node ) -> Node
sepByComma =
    Sep ( "", ", ", "" )


sepBySpace : List ( Range, Node ) -> Node
sepBySpace =
    Sep ( "", " ", "" )


sepBy : ( String, String, String ) -> List ( Range, Node ) -> Node
sepBy =
    Sep


append : Node -> Node -> Node
append =
    Append


join : List Node -> Node
join =
    Joined
