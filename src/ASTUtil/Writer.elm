module ASTUtil.Writer exposing (Writer, write, breaked, epsilon, parensComma, spaced, string, maybe, indent, bracesComma, sepBy, sepByComma, bracketsComma, sepBySpace, join, append)


type alias Writer =
    Node


type Node
    = Sep ( String, String, String ) Bool (List Node)
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
        Sep ( pre, sep, post ) differentLines items ->
            let
                -- differentLines =
                -- startOnDifferentLines (List.map Tuple.first items)
                seperator =
                    if differentLines then
                        "\n" ++ asIndent indent ++ sep
                    else
                        sep
            in
                String.concat
                    [ pre
                    , String.join seperator
                        (List.map (identity >> writeIndented indent) items)
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


parensComma : Bool -> List Node -> Node
parensComma =
    Sep ( "(", ", ", ")" )


bracesComma : Bool -> List Node -> Node
bracesComma =
    Sep ( "{", ", ", "}" )


bracketsComma : Bool -> List Node -> Node
bracketsComma =
    Sep ( "[", ", ", "]" )


sepByComma : Bool -> List Node -> Node
sepByComma =
    Sep ( "", ", ", "" )


sepBySpace : Bool -> List Node -> Node
sepBySpace =
    Sep ( "", " ", "" )


sepBy : ( String, String, String ) -> Bool -> List Node -> Node
sepBy =
    Sep


append : Node -> Node -> Node
append =
    Append


join : List Node -> Node
join =
    Joined
