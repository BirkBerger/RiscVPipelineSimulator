<?php

$comment = null;
if($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['assembly-editor'])) {
    $comment = $_POST['assembly-editor'];
}

?>

<!DOCTYPE html>
<html>
    <head>
        <title>Pipeline simulator</title>
        <link rel="stylesheet" href="codemirror-5.57.0/lib/codemirror.css">
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
        <script type="text/javascript" src="codemirror-5.57.0/lib/codemirror.js"></script>
        <script type="text/javascript" src="js/assemblyEditor.js"></script>
        <script type="text/javascript" src="codemirror-5.57.0/mode/verilog/verilog.js"></script>
    </head>

    <style>

    </style>

    <body>
        <form id="editor-form" method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
            <textarea id="assembly-editor"></textarea>
            <button class="pipeline-instructions-button" id="pipeline-instructions-button" name="pipeline-instructions-button" >Pipeline instructions</button>
        </form>

        <div id="editor-feedback"><?php echo $comment; ?></div>


        <textarea id="output"></textarea>

    </body>
</html>