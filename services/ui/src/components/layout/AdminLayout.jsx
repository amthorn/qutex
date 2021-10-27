import { Layout } from 'components/layout/Layout';
import React from 'react';

export const AdminLayout = ({ ...props }) => {
    return <Layout { ...props }>{ props.children }</Layout>
}