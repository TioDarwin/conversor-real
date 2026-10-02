export function LoadingState() {
  return (
    <div className="results-grid" aria-label="Carregando cotações" aria-busy="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="currency-card skeleton-card" key={index}>
          <div className="skeleton-topline"><span className="skeleton skeleton-flag" /><span className="skeleton skeleton-title" /></div>
          <span className="skeleton skeleton-label" />
          <span className="skeleton skeleton-value" />
          <span className="skeleton skeleton-rate" />
          <span className="skeleton skeleton-footer" />
        </div>
      ))}
      <span className="sr-only" role="status">Consultando as cotações mais recentes.</span>
    </div>
  )
}
