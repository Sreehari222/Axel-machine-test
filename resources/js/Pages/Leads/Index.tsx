import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import type { CSSProperties } from 'react';

type Lead = {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: string;
    created_at: string;
};

type PageLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    leads: {
        data: Lead[];
        current_page: number;
        last_page: number;
        links: PageLink[];
        total: number;
    };
    filters: {
        search: string;
        status: string;
        sort: 'asc' | 'desc';
    };
    statuses: string[];
};

/* ---------- design tokens ---------- */
const NAVY = '#2b3a55';
const TEXT = '#1e293b';
const MUTED = '#64748b';
const BORDER = '#e5e7eb';
const SOFT = '#f8fafc';

function statusStyle(status: string): CSSProperties {
    const value = status.toLowerCase();
    let bg = '#f97316';

    if (['active', 'qualified', 'converted', 'won'].includes(value)) {
        bg = '#22c55e';
    } else if (['lost', 'rejected'].includes(value)) {
        bg = '#ef4444';
    } else if (['inactive'].includes(value)) {
        bg = '#94a3b8';
    } else if (['pending', 'new', 'contacted'].includes(value)) {
        bg = '#16234a';
    }

    return {
        backgroundColor: bg,
        color: '#fff',
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: 'nowrap',
    };
}

/* ---------- styles ---------- */
const s: Record<string, CSSProperties> = {
    page: {
        boxSizing: 'border-box',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        padding: 24,
        background: '#fff',
        color: TEXT,
    },
    header: {
        textAlign: 'center',
    },
    title: {
        margin: 0,
        fontSize: 32,
        fontWeight: 700,
        letterSpacing: '-0.02em',
        color: NAVY,
    },
    subtitle: {
        margin: '8px auto 0',
        maxWidth: 640,
        fontSize: 14,
        color: MUTED,
    },
    toolbar: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        background: SOFT,
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
    },
    searchWrap: {
        position: 'relative',
        flex: '1 1 260px',
        minWidth: 220,
    },
    searchIcon: {
        position: 'absolute',
        left: 14,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 16,
        height: 16,
        color: '#94a3b8',
        pointerEvents: 'none',
    },
    field: {
        boxSizing: 'border-box',
        width: '100%',
        height: 40,
        padding: '0 16px',
        fontSize: 14,
        color: TEXT,
        background: '#fff',
        border: `1px solid ${BORDER}`,
        borderRadius: 999,
        outline: 'none',
    },
    selectWrap: {
        flex: '0 1 170px',
        minWidth: 150,
    },
    group: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    },
    spacer: {
        flex: '1 1 0',
    },
    btnBase: {
        boxSizing: 'border-box',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: 40,
        padding: '0 20px',
        fontSize: 14,
        fontWeight: 600,
        borderRadius: 999,
        cursor: 'pointer',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
    },
    btnPrimary: {
        background: NAVY,
        color: '#fff',
        border: `1px solid ${NAVY}`,
    },
    btnGhost: {
        background: '#fff',
        color: '#334155',
        border: `1px solid ${BORDER}`,
        fontWeight: 500,
    },
    card: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 360,
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        overflow: 'hidden',
        background: '#fff',
    },
    cardHead: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '14px 20px',
        borderBottom: `1px solid ${BORDER}`,
    },
    cardTitle: {
        margin: 0,
        fontSize: 16,
        fontWeight: 600,
        color: TEXT,
    },
    cardMeta: {
        fontSize: 13,
        color: MUTED,
    },
    scroll: {
        flex: 1,
        overflow: 'auto',
    },
    table: {
        width: '100%',
        minWidth: 900,
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: 14,
    },
    th: {
        position: 'sticky',
        top: 0,
        padding: '12px 20px',
        background: NAVY,
        color: '#fff',
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: 'nowrap',
    },
    td: {
        padding: '14px 20px',
        borderBottom: `1px solid #f1f5f9`,
        color: '#475569',
        verticalAlign: 'middle',
    },
    footer: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '12px 20px',
        borderTop: `1px solid ${BORDER}`,
        background: SOFT,
    },
    nav: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 6,
    },
    pageBtn: {
        boxSizing: 'border-box',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 34,
        minWidth: 34,
        padding: '0 12px',
        fontSize: 13,
        borderRadius: 8,
        border: `1px solid ${BORDER}`,
        background: '#fff',
        color: '#475569',
        textDecoration: 'none',
    },
};

const pageBtnActive: CSSProperties = {
    background: NAVY,
    color: '#fff',
    border: `1px solid ${NAVY}`,
    fontWeight: 600,
};

const pageBtnDisabled: CSSProperties = {
    background: SOFT,
    color: '#cbd5e1',
    cursor: 'not-allowed',
};

function cleanLabel(label: string) {
    return label.replace('&laquo;', '«').replace('&raquo;', '»');
}

export default function Index({ leads, filters, statuses }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [sort, setSort] = useState<'asc' | 'desc'>(filters.sort ?? 'desc');
    const [loggingOut, setLoggingOut] = useState(false);

    function applyFilters(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        router.post(
            '/leads/filter',
            { search, status, sort },
            { preserveScroll: true }
        );
    }

    function resetFilters() {
        setSearch('');
        setStatus('');
        setSort('desc');
        router.post('/leads/reset-filters', {}, {
            preserveScroll: true,
        });
    }

    function deleteLead(id: number) {
        if (window.confirm('Are you sure you want to delete this lead?')) {
            router.delete(`/leads/${id}`);
        }
    }

    function logout() {
        if (loggingOut) return;

        setLoggingOut(true);
        router.post('/logout', {}, {
            onFinish: () => setLoggingOut(false),
        });
    }

    return (
        <>
            <Head title="Lead List" />

            <style>{`
                .ll-row:hover td { background: #f8fafc; }
                .ll-btn:hover { opacity: .88; }
                .ll-page:hover { background: #f1f5f9; }
                .ll-icon:hover { opacity: .65; }
                .ll-field:focus { border-color: ${NAVY}; box-shadow: 0 0 0 3px rgba(43,58,85,.12); }
            `}</style>

            <div style={s.page}>
                {/* Header */}
                <header style={s.header}>
                    <h1 style={s.title}>Lead List</h1>
                </header>

                {/* Toolbar */}
                <form onSubmit={applyFilters} style={s.toolbar}>
                    <div style={s.searchWrap}>
                        <svg
                            style={s.searchIcon}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <circle cx="11" cy="11" r="7" />
                            <path d="m20 20-3.5-3.5" />
                        </svg>
                        <label htmlFor="lead-search" style={{ display: 'none' }}>
                            Search leads
                        </label>
                        <input
                            id="lead-search"
                            className="ll-field"
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            style={{ ...s.field, paddingLeft: 38 }}
                        />
                    </div>

                    <div style={s.selectWrap}>
                        <label htmlFor="lead-status" style={{ display: 'none' }}>
                            Status
                        </label>
                        <select
                            id="lead-status"
                            className="ll-field"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            style={s.field}
                        >
                            <option value="">All statuses</option>
                            {statuses.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={s.selectWrap}>
                        <label htmlFor="lead-sort" style={{ display: 'none' }}>
                            Sort by date
                        </label>
                        <select
                            id="lead-sort"
                            className="ll-field"
                            value={sort}
                            onChange={(e) =>
                                setSort(e.target.value as 'asc' | 'desc')
                            }
                            style={s.field}
                        >
                            <option value="desc">Newest first</option>
                            <option value="asc">Oldest first</option>
                        </select>
                    </div>

                    <div style={s.group}>
                        <button
                            type="submit"
                            className="ll-btn"
                            style={{ ...s.btnBase, ...s.btnPrimary }}
                        >
                            Apply Filters
                        </button>

                        <button
                            type="button"
                            onClick={resetFilters}
                            className="ll-btn"
                            style={{ ...s.btnBase, ...s.btnGhost }}
                        >
                            Reset
                        </button>
                    </div>

                    <div style={s.spacer} />

                    <div style={s.group}>
                        <button
                            type="button"
                            onClick={logout}
                            disabled={loggingOut}
                            className="ll-btn"
                            style={{
                                ...s.btnBase,
                                ...s.btnGhost,
                                opacity: loggingOut ? 0.6 : 1,
                                cursor: loggingOut ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loggingOut ? 'Logging out...' : 'Logout'}
                        </button>

                        <Link
                            href="/leads/create"
                            className="ll-btn"
                            style={{ ...s.btnBase, ...s.btnPrimary }}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                aria-hidden="true"
                            >
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            Create New Lead
                        </Link>
                    </div>
                </form>

                {/* Listing card: fills remaining page height */}
                <section style={s.card}>
                    <div style={s.cardHead}>
                        <h2 style={s.cardTitle}>All Leads</h2>
                        <span style={s.cardMeta}>
                            {leads.total} total {leads.total === 1 ? 'lead' : 'leads'}
                        </span>
                    </div>

                    <div style={s.scroll}>
                        <table style={s.table}>
                            <thead>
                                <tr>
                                    <th style={{ ...s.th, width: '6%' }}>#</th>
                                    <th style={{ ...s.th, width: '20%' }}>Name</th>
                                    <th style={{ ...s.th, width: '24%' }}>Email address</th>
                                    <th style={{ ...s.th, width: '15%' }}>Phone Number</th>
                                    <th style={{ ...s.th, width: '12%' }}>Status</th>
                                    <th style={{ ...s.th, width: '15%' }}>Created At</th>
                                    <th style={{ ...s.th, width: '8%', textAlign: 'center' }}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {leads.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            style={{ ...s.td, textAlign: 'center', padding: '64px 24px' }}
                                        >
                                            <p style={{ margin: 0, fontWeight: 600, color: TEXT }}>
                                                No leads found
                                            </p>
                                            <p style={{ margin: '6px 0 16px', fontSize: 13, color: MUTED }}>
                                                Try another search or create a new lead.
                                            </p>
                                            <Link
                                                href="/leads/create"
                                                className="ll-btn"
                                                style={{ ...s.btnBase, ...s.btnPrimary }}
                                            >
                                                + Create New Lead
                                            </Link>
                                        </td>
                                    </tr>
                                ) : (
                                    leads.data.map((lead) => (
                                        <tr key={lead.id} className="ll-row">
                                            <td style={{ ...s.td, color: MUTED }}>{lead.id}</td>

                                            <td style={{ ...s.td, color: TEXT, fontWeight: 500 }}>
                                                {lead.name}
                                            </td>

                                            <td style={{ ...s.td, wordBreak: 'break-word' }}>
                                                {lead.email || '—'}
                                            </td>

                                            <td style={{ ...s.td, whiteSpace: 'nowrap' }}>
                                                {lead.phone || '—'}
                                            </td>

                                            <td style={s.td}>
                                                <span style={statusStyle(lead.status)}>
                                                    {lead.status}
                                                </span>
                                            </td>

                                            <td style={{ ...s.td, whiteSpace: 'nowrap' }}>
                                                {lead.created_at || '—'}
                                            </td>

                                            <td style={s.td}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: 16,
                                                    }}
                                                >
                                                    <Link
                                                        href={`/leads/${lead.id}/edit`}
                                                        aria-label={`Edit ${lead.name}`}
                                                        title="Edit"
                                                        className="ll-icon"
                                                        style={{ display: 'inline-flex', color: '#475569' }}
                                                    >
                                                        <svg
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            aria-hidden="true"
                                                        >
                                                            <path d="M12 20h9" />
                                                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                                        </svg>
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => deleteLead(lead.id)}
                                                        aria-label={`Delete ${lead.name}`}
                                                        title="Delete"
                                                        className="ll-icon"
                                                        style={{
                                                            display: 'inline-flex',
                                                            padding: 0,
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            color: '#ef4444',
                                                        }}
                                                    >
                                                        <svg
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            aria-hidden="true"
                                                        >
                                                            <path d="M3 6h18" />
                                                            <path d="M8 6V4h8v2" />
                                                            <path d="M19 6l-1 14H6L5 6" />
                                                            <path d="M10 11v6M14 11v6" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination pinned to the bottom of the card */}
                    <div style={s.footer}>
                        <p style={{ margin: 0, fontSize: 13, color: MUTED }}>
                            Showing page{' '}
                            <strong style={{ color: TEXT }}>{leads.current_page}</strong> of{' '}
                            <strong style={{ color: TEXT }}>{leads.last_page}</strong>
                        </p>

                        <nav aria-label="Lead pagination" style={s.nav}>
                            {leads.links.map((link, index) =>
                                link.url ? (
                                    <Link
                                        key={`${index}-${link.label}`}
                                        href={link.url}
                                        preserveScroll
                                        className={link.active ? undefined : 'll-page'}
                                        style={{
                                            ...s.pageBtn,
                                            ...(link.active ? pageBtnActive : {}),
                                        }}
                                    >
                                        {cleanLabel(link.label)}
                                    </Link>
                                ) : (
                                    <span
                                        key={`${index}-${link.label}`}
                                        style={{ ...s.pageBtn, ...pageBtnDisabled }}
                                    >
                                        {cleanLabel(link.label)}
                                    </span>
                                )
                            )}
                        </nav>
                    </div>
                </section>
            </div>
        </>
    );
}
