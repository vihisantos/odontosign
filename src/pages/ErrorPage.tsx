import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { motion } from "motion/react";

export default function ErrorPage() {
  const error = useRouteError();

  let title = "Algo deu errado!";
  let message = "Não esperávamos que isso acontecesse. Tente novamente ou volte para o início.";
  let statusCode = 500;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    switch (error.status) {
      case 404:
        title = "Página não encontrada";
        message = "O que você procura não existe ou foi movido para outro lugar.";
        break;
      case 403:
        title = "Acesso negado";
        message = "Você não tem permissão para acessar esta página.";
        break;
      case 500:
        title = "Erro no servidor";
        message = "Algo quebrou do nosso lado. Já estamos trabalhando nisso.";
        break;
      default:
        title = `Erro ${error.status}`;
        message = error.statusText || "Ocorreu um erro inesperado.";
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-destructive/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md text-center"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <span className="text-[8rem] sm:text-[10rem] font-bold leading-none bg-gradient-to-br from-primary/20 to-destructive/20 bg-clip-text text-transparent select-none">
            {statusCode}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl flex items-center justify-center border border-primary/10">
            <svg className="w-16 h-16 text-primary/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{title}</h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8 max-w-sm mx-auto">{message}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button asChild size="lg" className="shadow-lg shadow-primary/20">
            <Link to="/odontosign/">Voltar ao Início</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/odontosign/login">Fazer Login</Link>
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-xs text-muted-foreground"
        >
          Se o problema persistir, entre em contato com o suporte.
        </motion.p>
      </motion.div>
    </div>
  );
}
