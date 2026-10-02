import { ExternalLink, Info, UserRound } from 'lucide-react'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-meta">
        <div className="footer-note">
          <Info size={15} aria-hidden="true" />
          <span>
            As taxas exibidas são referências e podem variar entre instituições financeiras.
          </span>
        </div>

        <div className="footer-author">
          <UserRound size={14} aria-hidden="true" />
          <span>
            Criado por <strong>Hugo Trindade</strong>
          </span>
        </div>
      </div>

      <a
        href="https://www.frankfurter.app/"
        target="_blank"
        rel="noreferrer"
      >
        Dados via Frankfurter
        <ExternalLink size={13} aria-hidden="true" />
      </a>
    </footer>
   )
}
