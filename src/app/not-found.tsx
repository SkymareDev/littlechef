import Link from 'next/link';
export default function NotFound() {
  return (<div className="wrap page-head" style={{ paddingBottom: 96 }}><h1>That’s not on the menu</h1>
    <p className="lede">The page may have moved. Head back to the kitchen and try another one.</p><p style={{ marginTop: 24 }}><Link className="btn btn-primary" href="/">Back to the home page</Link></p></div>);
}
