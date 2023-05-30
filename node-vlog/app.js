var createError = require("http-errors");
var session = require("express-session");
var flash = require("express-flash");
var express = require("express");
var logger = require("morgan");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var db = require("./database");
var app = express();

// Configurações do aplicativo
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "123@123abc",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);
app.use(flash());

// Rota inicial - Exibição do formulário
app.get("/", function (req, res, next) {
  res.render("index", { title: "Formulário de Livros", messages: req.flash() });
});

// Rota para processar o envio do formulário
app.post("/user_form", function (req, res, next) {
  var nomeLivro = req.body.Nome_Livro;
  var isbn13 = req.body.ISBN13;
  var isbn10 = req.body.ISBN10;
  var idCategoria = req.body.ID_Categoria;
  var idAutor = req.body.ID_Autor;
  var idEditora = req.body.ID_Editora;
  var dataPub = req.body.Data_Pub;
  var precoLivro = req.body.Preco_Livro;

  var sql = `INSERT INTO tbl_livro (Nome_Livro, ISBN13, ISBN10, ID_Categoria, ID_Autor, ID_Editora, Data_Pub, Preco_Livro) VALUES
  ("${nomeLivro}", "${isbn13}", "${isbn10}", "${idCategoria}", "${idAutor}", "${idEditora}", "${dataPub}", "${precoLivro}")`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Registro atualizado");
    req.flash("success", "Dado armazenado!");
    res.redirect("/");
  });
});
// Tratamento de erros
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

// Inicialização do servidor
var port = process.env.PORT || 5555;
app.listen(port, function () {
  console.log("Servidor está rodando na porta:", port);
});

module.exports = app;
