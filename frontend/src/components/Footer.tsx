function Footer() {
  return (
    <footer className="bg-dark text-light py-3 mt-auto shadow-sm w-100">
      <div className="container text-center">
        © {new Date().getFullYear()} C4P • Desenvolvido por sua equipe • Todos os direitos reservados
      </div>
    </footer>
  );
}

export default Footer;
