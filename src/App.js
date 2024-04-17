import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Flex,
  Image,
  Heading,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

function App() {
  const [products, setProducts] = useState([]);
  const initialProductState = {
    productName: "",
    price: 0,
    description: "",
    initialStock: 0
  };
  const [addProduct, setAddProduct] = useState(initialProductState);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    axios.post('/api/products', addProduct)
      .then(() => {
        toast({
          title: 'Product Added',
          description: "Product has been added successfully.",
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        fetchProducts();
        setAddProduct(initialProductState);
        onClose();
      })
      .catch(error => {
        toast({
          title: 'Error',
          description: "Failed to add product.",
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        console.error('Error creating product:', error);
      })
  }

  const deleteProduct = (productId) => {
    axios.delete(`/api/products/${productId}`)
      .then(() => {
        toast({
          title: 'Product deleted.',
          description: "The product has been removed from your inventory.",
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        fetchProducts();
      })
      .catch(error => {
        toast({
          title: 'Failed to delete product.',
          description: "There was an issue deleting the product.",
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        console.error('Error deleting product:', error);
      });
  };

  return (
    <Box className="App" p={3}>
      <Flex direction="row" gap={5} align="center">
        <Image boxSize="100px" src='https://ucontent.prdg.io/img/my-points/mg-logo/mg1948.png?v=1694022942000' alt='Newegg Logo' />
        <Heading>Marketplace</Heading>
        <Button onClick={onOpen}>Add Product</Button>
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Product Name</Th>
            <Th isNumeric>Price</Th>
            <Th>Description</Th>
            <Th isNumeric>Stock</Th>
            <Th>Delete</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map(product => (
            <Tr key={product.productId}>
              <Td>{product.productId}</Td>
              <Td style={{ textDecoration: !product.available ? 'line-through' : 'none' }}>{product.productName}</Td>
              <Td isNumeric style={{ textDecoration: !product.available ? 'line-through' : 'none' }}>${product.price.toFixed(2)}</Td>
              <Td style={{ textDecoration: !product.available ? 'line-through' : 'none' }}>{product.description}</Td>
              <Td isNumeric color={product.available ? 'none' : 'red'}>{product.stock}</Td>
              <Td textAlign="center">
                <IconButton
                  aria-label="Delete product"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  onClick={() => deleteProduct(product.productId)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Product Name</FormLabel>
              <Input name="productName" value={addProduct.productName} onChange={handleChange} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Price</FormLabel>
              <NumberInput precision={2} step={0.01}>
                <NumberInputField name="price" value={addProduct.price} onChange={handleChange} />
              </NumberInput>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input name="description" value={addProduct.description} onChange={handleChange} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Initial Stock</FormLabel>
              <NumberInput>
                <NumberInputField name="initialStock" value={addProduct.initialStock} onChange={handleChange} />
              </NumberInput>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' onClick={handleSubmit}>Confirm</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default App;
