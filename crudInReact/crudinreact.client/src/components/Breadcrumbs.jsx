// src/components/Breadcrumbs.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import useBreadcrumbs from 'use-react-router-breadcrumbs';
import routes from '../routes/breadcrumbRoutes';

const Breadcrumbs = () => {
    const breadcrumbs = useBreadcrumbs(routes);

    return (
        <nav aria-label="breadcrumb" style={{ padding: '10px' }}>
            {breadcrumbs.map(({ match, breadcrumb }, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                    <span key={match.pathname}>
                        {!isLast ? (
                            <>
                                <Link to={match.pathname}>{breadcrumb}</Link>
                                {' / '}
                            </>
                        ) : (
                            <span>{breadcrumb}</span>
                        )}
                    </span>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs;
