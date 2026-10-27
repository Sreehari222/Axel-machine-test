import { Head, Link, useForm } from '@inertiajs/react';
import type { CSSProperties, FormEvent } from 'react';

type Lead = {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: string;
};

type Props = {
    lead?: Lead;
    statuses: string[];
};

/* ---------- design tokens (same as the lead list page) ---------- */
const NAVY = '#2b3a55';
const TEXT = '#1e293b';
const MUTED = '#64748b';
const BORDER = '#e5e7eb';
const SOFT = '#f8fafc';
const DANGER = '#ef4444';

const s: Record<string, CSSProperties> = {
    page: {
        boxSizing: 'border-box',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
        maxWidth: 520,
        fontSize: 14,
        color: MUTED,
    },
    card: {
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: 640,
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        background: '#fff',
        overflow: 'hidden',
    },
    cardHead: {
        padding: '14px 24px',
        borderBottom: `1px solid ${BORDER}`,
        background: SOFT,
        fontSize: 16,
        fontWeight: 600,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        padding: 24,
    },
    row: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 20,
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        minWidth: 0,
    },
    label: {
        fontSize: 13,
        fontWeight: 600,
        color: '#334155',
    },
    input: {
        boxSizing: 'border-box',
        width: '100%',
        height: 44,
        padding: '0 16px',
        fontSize: 14,
        color: TEXT,
        background: '#fff',
        border: `1px solid ${BORDER}`,
        borderRadius: 999,
        outline: 'none',
    },
    error: {
        margin: 0,
        paddingLeft: 4,
        fontSize: 13,
        color: DANGER,
    },
    actions: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 12,
        paddingTop: 20,
        borderTop: `1px solid ${BORDER}`,
    },
    btnBase: {
        boxSizing: 'border-box',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        padding: '0 24px',
        fontSize: 14,
        fontWeight: 600,
        borderRadius: 999,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
    },
};

function inputStyle(hasError: boolean): CSSProperties {
    return hasError ? { ...s.input, borderColor: DANGER } : s.input;
}

export default function LeadForm({ lead, statuses }: Props) {
    const editing = Boolean(lead);

    const form = useForm({
        name: lead?.name ?? '',
        email: lead?.email ?? '',
        phone: lead?.phone ?? '',
        status: lead?.status ?? statuses[0] ?? 'New',
    });

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (editing && lead) {
            form.put(`/leads/${lead.id}`);
        } else {
            form.post('/leads');
        }
    }

    return (
        <>
            <Head title={editing ? 'Edit Lead' : 'Create Lead'} />

            <style>{`
                .lf-input:focus { border-color: ${NAVY} !important; box-shadow: 0 0 0 3px rgba(43,58,85,.12); }
                .lf-btn:hover:not(:disabled) { opacity: .88; }
            `}</style>

            <main style={s.page}>
                <header style={s.header}>
                    <h1 style={s.title}>{editing ? 'Edit Lead' : 'Create Lead'}</h1>
                    <p style={s.subtitle}>
                        {editing
                            ? 'Update the contact details and status for this lead.'
                            : 'Add a new contact to your business leads.'}
                    </p>
                </header>

                <section style={s.card}>
                    <div style={s.cardHead}>Lead details</div>

                    <form onSubmit={submit} style={s.form}>
                        <div style={s.field}>
                            <label htmlFor="name" style={s.label}>
                                Name
                            </label>

                            <input
                                id="name"
                                className="lf-input"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                                style={inputStyle(Boolean(form.errors.name))}
                            />

                            {form.errors.name && (
                                <p style={s.error}>{form.errors.name}</p>
                            )}
                        </div>


                        <div style={s.row}>
                            <div style={s.field}>
                                <label htmlFor="email" style={s.label}>
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    className="lf-input"
                                    value={form.data.email}
                                    onChange={(e) =>
                                        form.setData('email', e.target.value)
                                    }
                                    onBlur={() => {
                                        const email = form.data.email.trim();
                                        if (
                                            email &&
                                            !/^[^\s@]+@[^\s@]+\.com$/i.test(email)
                                        ) {
                                            form.setError(
                                                'email',
                                                'Enter a valid email address ending in .com.'
                                            );
                                        } else {
                                            form.clearErrors('email');
                                        }
                                    }}
                                    style={inputStyle(Boolean(form.errors.email))}
                                />

                                {form.errors.email && (
                                    <p style={s.error}>{form.errors.email}</p>
                                )}
                            </div>

                            <div style={s.field}>
                                <label htmlFor="phone" style={s.label}>
                                    Phone
                                </label>

                                <input
                                    id="phone"
                                    type="tel"
                                    className="lf-input"
                                    value={form.data.phone}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        form.setData('phone', value);

                                        if (value.length >= 10) {
                                            form.clearErrors('phone');
                                        }
                                    }}
                                    onBlur={() => {
                                        const digits = form.data.phone.replace(/\D/g, '');

                                        if (digits.length < 10) {
                                            form.setError(
                                                'phone',
                                                'Phone number must contain at least 10 digits.'
                                            );
                                        } else {
                                            form.clearErrors('phone');
                                        }
                                    }}
                                    inputMode="numeric"
                                    maxLength={15}
                                    style={inputStyle(Boolean(form.errors.phone))}
                                />

                                {form.errors.phone && (
                                    <p style={s.error}>{form.errors.phone}</p>
                                )}
                            </div>
                        </div>


                        <div style={s.field}>
                            <label htmlFor="status" style={s.label}>
                                Status
                            </label>

                            <select
                                id="status"
                                className="lf-input"
                                value={form.data.status}
                                onChange={(e) =>
                                    form.setData('status', e.target.value)
                                }
                                style={inputStyle(Boolean(form.errors.status))}
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>

                            {form.errors.status && (
                                <p style={s.error}>{form.errors.status}</p>
                            )}
                        </div>

                        <div style={s.actions}>
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="lf-btn"
                                style={{
                                    ...s.btnBase,
                                    background: NAVY,
                                    color: '#fff',
                                    border: `1px solid ${NAVY}`,
                                    cursor: form.processing ? 'not-allowed' : 'pointer',
                                    opacity: form.processing ? 0.5 : 1,
                                }}
                            >
                                {form.processing
                                    ? 'Saving...'
                                    : editing
                                        ? 'Update Lead'
                                        : 'Create Lead'}
                            </button>

                            <Link
                                href="/leads"
                                className="lf-btn"
                                style={{
                                    ...s.btnBase,
                                    background: '#fff',
                                    color: '#334155',
                                    border: `1px solid ${BORDER}`,
                                    fontWeight: 500,
                                }}
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </section>
            </main>
        </>
    );
}
